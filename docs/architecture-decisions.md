## Frontend architecture

- Express will serve both the frontend application and the JSON API.
- The frontend will use vanilla HTML, CSS, and JavaScript.
- Distinct areas of the application will use separate HTML documents rather than one universal empty shell.
- Each HTML document will contain its major page structure.
- JavaScript will fetch and insert dynamic data, but it will not construct entire page layouts.
- You likely do not need EJS, Pug, Handlebars, or another server-side template engine.
- Express must serve the complete client directory, including CSS, JavaScript, images, fonts, icons, and nested assets.
- Local development should include automatic Node restarts and browser refreshing.

## Reader URLs and navigation

- Chapters will have clean, meaningful URLs containing the current book and chapter.
- Chapter URLs must:
    - Survive a browser refresh.
    - Be bookmarkable and shareable.
    - Support browser back and forward navigation.
    - Provide stable destinations for search results.
- Express will map reader URLs to the reader HTML document.
- Reader-specific JavaScript will read the route parameters, request the correct chapter from the API, and populate the document.
- Search results may use fragments or another identifier to scroll to and highlight a specific sentence, but sentence-level URL behavior has not been finalized.

## Frontend decisions still required

Before Codex scaffolds the frontend, you will create:

- A rough page map.
- A rough URL map.

You still need to decide:

- Which user experiences deserve separate HTML documents.
- Whether the homepage, book index, search form, search results, book overview, chapter list, and reader should be separate or combined.
- Whether search results appear beneath the search form or on a dedicated results page.
- What information belongs in the URL.
- What should be bookmarkable or shareable.
- What state should remain only in JavaScript.

You do not need to decide the styling or every individual component yet.

## SQLite and database deployment

- SQLite remains the chosen database.
- The generated SQLite database will remain excluded from Git.
- The database is treated as a reproducible runtime artifact, not version-controlled source.
- The preferred deployment process is:
    1. Deploy the application code and canonical source texts.
    2. Install the dependencies on the server.
    3. Run the importer on the server.
    4. Generate the production SQLite database there.
- The database must live on persistent local storage.
- It must remain outside the publicly served client directory.
- Only the Node application should access the database.
- Express’s static-file configuration and Nginx must never expose the database directly.

## CORS and rate limiting

- The frontend and API will use the same origin.
- CORS is therefore unnecessary initially.
- Permissive global CORS will not be enabled.
- A narrow CORS allowlist should be added only if a legitimate external frontend eventually needs access.
- Rate limiting will be added before launch.
- Search may receive stricter limits than ordinary metadata endpoints because it is potentially more expensive.
- Exact limits will be chosen after the frontend’s normal request behavior is known.

## Production hosting

- The application will be deployed to a DigitalOcean Ubuntu droplet.
- Nginx will act as the public-facing reverse proxy.
- Express will run behind Nginx and bind only to the appropriate local interface.
- Node will run continuously under a production process manager such as PM2 or systemd.
- Nodemon will be used only for local development.
- HTTPS will be configured through Let’s Encrypt and Certbot.
- Node will run under a dedicated non-root application user.
- Root SSH access will be disabled.
- Cloudflare will not be used initially.

## Production security

Security work will be handled in a dedicated production-hardening and deployment prompt after the API and page routes are established.

That work should include:

- Security-related HTTP headers.
- Query-parameter validation and length limits.
- Safe construction of full-text-search expressions.
- API rate limiting.
- Request-body limits.
- Generic production error responses without stack traces or SQL details.
- Disabling the `X-Powered-By` header.
- Dependency auditing and updates.
- Appropriate SQLite ownership and filesystem permissions.
- Logging for unexpected errors and rejected requests.
- Correct trusted-proxy configuration behind Nginx.

## Next implementation step

For the next stream, the plan is to:

1. Review the completed scaffold for anything unusual.
2. Write and run Prompt 4 for the importer.

The frontend page and URL decisions need to be completed before the frontend-scaffolding prompt, but they do not block the importer work.
