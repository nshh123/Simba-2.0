<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Git & Deployment Workflow
- **Auto-Commit & Push**: Whenever you finish completing user-requested modifications, bug fixes, or features, stage all modified and relevant files (`git add .`), create a clear, conventional commit message (`git commit -m "..."`), and push to GitHub (`git push origin main` or current branch) so changes immediately sync and trigger CI/CD deployment.
