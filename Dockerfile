# Credits/Reference:  https://github.com/Antioch-Tech/bible-vector-search-api/blob/5d0eb2a3c699c0ddfbf7ba83b1a89cb655ebc023/Dockerfile

FROM python:3.12.7-slim-bookworm AS builder

RUN pip install poetry==1.8.3

ENV POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_VIRTUALENVS_CREATE=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache

WORKDIR /app

COPY pyproject.toml poetry.lock ./

# install build dependencies
RUN --mount=type=cache,target=$POETRY_CACHE_DIR poetry install --without dev --no-root

FROM python:3.12.7-slim-bookworm as runtime
WORKDIR /app
EXPOSE 8000

ENV VIRTUAL_ENV=/app/.venv \
    PATH="/app/.venv/bin:$PATH" \
    PYTHONDONTWRITEBYTECODE=1 \
    DEBUG=False \
    PYTHONFAULTHANDLER=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONHASHSEED=random \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100


COPY --from=builder ${VIRTUAL_ENV} ${VIRTUAL_ENV}
COPY . /app
# remove client-side folder we don't need it for backend api docker image
RUN rm -Rf clients-side/
COPY clients-side/frontend/prompt-smith-frontend/config/ /app/clients-side/frontend/prompt-smith-frontend/config/


RUN chmod -R +x infra/scripts/start.sh
ENTRYPOINT ["infra/scripts/start.sh"]
