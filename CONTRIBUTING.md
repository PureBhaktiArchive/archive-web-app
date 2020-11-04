_sri sri guru gaurangau jayatah_

# Contributing

## Development workflow

We're using a workflow similar to [GitHub flow](https://guides.github.com/introduction/flow/).

1. Clone the repo.
1. Create a branch from the `main` branch and name it according to your Trello card.

   - Use `kebab-case` for a branch name.
   - Use short and descriptive branch name. For example, `continuous-integration` or `audio-player-position`.

1. Commit your changes. See [Git Commits Styleguide](#git-commits) below.

1. Push your branch to GitHub and create a [draft pull request](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/about-pull-requests#draft-pull-requests).

   - Name the pull request according to the Trello card and put the card link into the description of the pull request.
   - Pull request will be attached to the card automatically.
   - A series of automatic checks will run: build, lint, test. You can see the results in the `Checks` tab of the pull request. Please fix all the found issues.
   - Add more commits to the branch if needed. Try to avoid force-pushing.
   - Merge `main` into your branch if there are conflicts or if needed for any other reason.

1. [Mark your pull-request as ready for review](https://help.github.com/en/articles/changing-the-stage-of-a-pull-request) when you believe you’ve finished with the task. The card will be moved into the `In Review` list automatically.
1. After review, the card will be automatically moved either back to `In Development` if some changes are required, or moved further to `Deployment` if the pull request is merged.

## Styleguides

### Git Commits

- **Use imperative present tense for the commit message first line.** Instead of “I added tests for…” or “Adding tests for…” use “Add tests for…” — [Source](https://www.git-scm.com/book/id/v2/Distributed-Git-Contributing-to-a-Project), [Also good to read](https://medium.com/@danielfeelfine/commit-verbs-101-why-i-like-to-use-this-and-why-you-should-also-like-it-d3ed2689ef70).

- **Don't include irrelevant changes into commits.** Only changes aimed to resolve the task should be included into commits of the task branch. Inspect your changes attentively before committing. Use some good tool like TortoiseGIT or VSCode's built-in Source Control panel, it helps gaining control on what you commit. If you feel that some other code should be improved, let's discuss this and create a separate task.

- When you merge `main` into your branch for resolving conflicts, **don't include any additional changes into the merge commit besides conflicts resolution**. Further code adjustments should be committed separately after merge.

### Code style

We use [Prettier](https://prettier.io/) for formatting the code. There is a Prettier config file and [EditorConfig](https://editorconfig.org/) file in the root of the repository.

Prettier checks the formatting in the CI workflow and will fail the required check.

See the [Editor Integration](https://prettier.io/docs/en/editors.html) section on the official website to find how to configure your editor.

We recommend using VSCode. This repository contains VSCode-specific settings and recommended extensions.
