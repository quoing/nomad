import Controller from '@ember/controller';
import WithNamespaceResetting from 'nomad-ui/mixins/with-namespace-resetting';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import { union } from '@ember/object/computed';

export default class JobsJobServicesIndexController extends Controller.extend(
  WithNamespaceResetting
) {
  @alias('model') job;
  @alias('job.taskGroups') taskGroups;

  @computed('taskGroups.@each.tasks')
  get tasks() {
    return this.taskGroups.map((group) => group.tasks.toArray()).flat();
  }

  @computed('tasks.@each.services')
  get taskServices() {
    return this.tasks
      .map((t) => (t.services || []).toArray())
      .flat()
      .compact()
      .map((service) => {
        service.level = 'task';
        return service;
      });
  }

  @computed('model.taskGroup.services.@each.name', 'taskGroups')
  get groupServices() {
    return this.taskGroups
      .map((g) => (g.services || []).toArray())
      .flat()
      .compact()
      .map((service) => {
        service.level = 'group';
        return service;
      });
  }

  @union('taskServices', 'groupServices') serviceFragments;

  // Services, grouped by name, with aggregatable allocations.
  @computed(
    'job.services.@each.{name,allocation}',
    'job.services.length',
    'serviceFragments'
  )
  get services() {
    console.log(
      'calc services; do i have a job?',
      this.job,
      this.job.services.mapBy('name')
    );
    return this.serviceFragments.map((fragment) => {
      // console.log("======== fragment", fragment.name);
      fragment.instances = this.job.services.filter((s) => {
        // console.log('checking for service', s.name);
        return s.name === fragment.name && s.derivedLevel === fragment.level;
      });
      return fragment;
    });
  }
}
