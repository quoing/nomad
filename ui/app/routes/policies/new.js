import Route from '@ember/routing/route';

const INITIAL_POLICY_RULES = `
# See https://learn.hashicorp.com/tutorials/nomad/access-control-policies for ACL Policy details

# Example policy structure:

namespace "default" {
  policy = "deny"
  capabilities = []
}

namespace "example-ns" {
  policy = "deny"
  capabilities = ["list-jobs", "read-job"]
}

host_volume "example-volume" {
  policy = "deny"
}

agent {
  policy = "deny"
}

node {
  policy = "deny"
}

quota {
  policy = "deny"
}

operator {
  policy = "deny"
}

# Possible Namespace Policies:
#  * deny
#  * read
#  * write
#  * scale

# Possible Namespace Capabilities:
#  * list-jobs
#  * parse-job
#  * read-job
#  * submit-job
#  * dispatch-job
#  * read-logs
#  * read-fs
#  * alloc-exec
#  * alloc-lifecycle
#  * csi-write-volume
#  * csi-mount-volume
#  * list-scaling-policies
#  * read-scaling-policy
#  * read-job-scaling
#  * scale-job

# Possible Policies for "agent", "node", "quota", "operator", and "host_volume":
#  * deny
#  * read
#  * write
`;

export default class PoliciesNewRoute extends Route {
  model() {
    return this.store.createRecord('policy', {
      rules: INITIAL_POLICY_RULES,
    });
  }

  resetController(controller, isExiting) {
    // If the user navigates away from /new, clear the path
    controller.set('path', null);
    if (isExiting) {
      // If user didn't save, delete the freshly created model
      if (controller.model.isNew) {
        controller.model.destroyRecord();
      }
    }
  }
}
