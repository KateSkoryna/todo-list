# My Project Notes

- Styling: Used Tailwind CSS to simplify styling.
- Data Fetching: Implemented TanstackReact Query for fetching data.
- Navigation: Used React DOM for routing/navigation.
- Database: Experimented with MongoDB as it was mentioned in the job description.
- ToDo Functionality: Implemented an Edit ToDo feature. Attempted to write E2E tests for it, but the tests kept failing. Due to time constraints, E2E tests for editing functionality were not completed.
- Thanks for this project!

# Full-Stack React-Express Project

This task covers React basics together with Node.js/Express as well as your testing skills.

To ease your start, a [Nx skeleton](Nx.md) is provided in this repo. Please get familiar with it so that you understand where your code belongs too.
The setup assumes you have a **MySql** database running on port **3306** with username **root** and password **root**. Nevertheless, you're free
to change the database to whatever you like. If you do so ensure you commit all necessary code changes such that it can be executed by the reviewer.

## General

- Focus on a working solution rather than the most beautiful or complex one.
- You have to create a `develop` branch. Think about creating more branches for the tasks.
- You are allowed to merge between task/feature branches.
- When you finished all tasks please create a pull request/merge request back to `main` and assign it to @expertsieve.
- If you can not finish a task or have an issue during implementation try to explain it in the merge request description and/or `README` file
- Leave some documentation about how to build your solution if you do not use Nx or do something else. (In this case built.sh and start.sh scripts are welcome)
- If you have any questions during your test task, please visit https://expertsieve.freshdesk.com or write an email to support@fyltura.com - Support usually answers within two hours.

## Task 1

Create an Express-based[^2] backend that implemented the [API given in this swagger file](tools/swagger.yml) with a local database connection. Please do not change the API. But it's allowed to add more endpoints if needed.

## Task 2

Add tests for your backend implementation if not yet done.

## Task 3

Create a React-based[^1] frontend for the backend from Task 1.

## Task 4

Provide end-to-end tests for your frontend implementation.

## Bonus

If you have time and feel lucky: Add multi-user support to the API (and to your implementation). It's ok to distinguish users just by IDs.

## Expectations

- Document your coding process with Git[^5] and publish your result to the repository you got along with
  these tasks. We will then clone your code and run it locally on our machines.
- The result in the repository should be a git history of your development process (a single commit with
  the complete application is not acceptable).
- We want to see multiple commits showing your progress, a README document on how to install and start your application.
- Extensive styling of your html is not necessary. Simple is better than complicated. But it shall be usable.
- Consider your application a proof-of-concept, quicker development using tools to achieve the result is better than handcrafting every line but taking 5x as long.
- You can use whatever resources/libraries/open-source in addition (but not as a replacement) of the libraries previously mentioned.
- If you use a cli that writes 98% of your code, fine!
- If you have any questions do not hesitate to contact us.

[^1]: https://reactjs.org
[^2]: https://expressjs.com/
[^5]: https://git-scm.com
