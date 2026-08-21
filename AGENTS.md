<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

- The "middleware" file convention is deprecated. Please use "proxy" instead.
- NEVER use em-dash

## Design system

The design system is specified in @DESIGN.md (role-abstract spec + current cobalt/bone/Manrope instantiation). Its instantiation decisions are recorded in `docs/adr/0006-portfolio-brand-instantiation.md`. Work that touches surface vocabulary, color, type, radius, or the brand primitives under `components/ui/brand/` must anchor to these rather than styling ad-hoc.