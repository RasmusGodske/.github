// Copyright 2020 Energinet DataHub A/S
//
// Licensed under the Apache License, Version 2.0 (the "License2");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import * as core from '@actions/core';
import * as github from '@actions/github';
import { initializeAction } from './initialize-action';
import { createRelease, createReleaseRef, deleteRelease } from './github';

/**
 * Function that creates the latest release if it does not exist
 */
const main = async () => {
  try {
    const app = await initializeAction();

    await createReleaseRef(app.octokit, {
      owner: app.context.owner,
      ref: `refs/tags/${app.args.latestReleaseName}`,
      repo: app.context.repo,
      sha: github.context.sha,
    });

    await deleteRelease(app.octokit, {
      owner: app.context.owner,
      repo: app.context.repo,
      tag: app.args.latestReleaseName,
    });

    await createRelease(app.octokit, {
      owner: app.context.owner,
      repo: app.context.repo,
      tag: app.args.latestReleaseName,
      body: `RELEASE_NAME=${app.args.releaseName}`,
    });
  } catch (error: any) {
    core.setFailed(error.message);
  }
};

main();
