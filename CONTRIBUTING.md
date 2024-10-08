
## Stacks

- Django
- Djanog Ninja
- Next.js

### Tools are used
- poetry
- pnpm 
- docker


## How to run the project locally

### Run on local machine using docker-compose

1. Clone the repository
2. Run the docker-compose
   - `docker-compose up --build`



### Run on local machine natively
> please set up your local db firstly and set up .env file properly

1. Clone the repository
2. Install the dependencies, `poetry lock`
3. Run the API
   4. `poetry run python manage.py runserver`
5. Run the next.js app
   6. `cd client-side/front-end/prompt-smith-front-end`
   7. `pnpm install`
   8. `pnpm run dev`

> localhost:3000
