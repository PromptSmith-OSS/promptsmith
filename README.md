# Prompt Smith

A prompt engineering solution to manage Gen AI prompts easily.


## Features
- Self-hosted option with full control over data
- Dockerized for easy deployment
- RESTful API for easy integration
  - With SDK for Python and Node.js.
- API Key management through centralized UI
- Prompt Management through centralized UI
  - Variants
  - Versioning (database level)

## How to use

1. Start the service locally `docker-compose up --build`
2. Access the at `http://localhost:3000`
3. Default login credentials (this could be set in docker compose file, please do not use default credentials in production)
   - email: `admin@localhost.lan`
   - password: `AwesomePromptsManagement`
4. Create a prompt at `http://localhost:3000/prompt`
5. Create an API key at `http://localhost:3000/key`
4. Get your prompts with ease through RESTful API
```shell
curl "http://localhost:3000/api/bff/api/sdk/prompt/{prompt-key}" \
     -H 'Authorization: Bearer {api-key}' \
     -H 'Content-Type: application/json; charset=utf-8' 
```
6. Or Get prompts through SDK
   - [Python SDK and Python Example](https://github.com/PromptSmith-OSS/promptsmith-python-sdk)
   - [Node.js SDK and JS/TS Example](https://github.com/PromptSmith-OSS/promptsmith-js-sdk)





> We have deployed a [Demo Instance](https://app.demo.promptsmith.dev)
> - Please note the data may not be persisted and will be deleted scheduledly.

## Development and Contribution
- [Contribution Guide](CONTRIBUTING.md)


### Features in the future
- [ ] Prompt Compression, to reduce the cost of token usage but still maintain the quality of prompts
- [ ] SaaS version of Prompt Smith.
- [ ] Webhook support.
- [ ] Prompt Management through CLI.
- [ ] Integration with analytics tools, such as Google Analytics, Mixpanel, etc.


> Please feel free to open an issue or PR for any feature requests or bug reports.
