# Project Overview

This is a Next.js and TypeScript project for a landing page for "ParaCleanse Elite," a health product. The project uses Tailwind CSS for styling and integrates with Shopify for e-commerce functionality. It also includes a blog, which is managed through local MDX files.

The primary goal of the project is to provide a comprehensive landing page that educates users about the product, showcases testimonials, and drives sales through a Shopify integration.

## Key Technologies

- **Framework:** Next.js 14.1.0
- **Language:** TypeScript
- **Styling:** Tailwind CSS with shadcn/ui components
- **E-commerce:** Shopify Storefront API
- **Content:** Local MDX files for the blog (`/content/blog`)
- **Deployment:** Docker

# Building and Running

The following scripts are available in `package.json`:

- **`npm run dev`**: Starts the development server at `http://localhost:3000`.
- **`npm run build`**: Creates a production build of the application.
- **`npm run start`**: Starts the production server.
- **`npm run lint`**: Lints the codebase using ESLint.

## Local Development

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Create a `.env.local` file with the following variables:
    ```env
    NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
    NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-token
    NEXT_PUBLIC_PRODUCT_ID=your-product-id
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```

# Development Conventions

## Project Structure

The project follows the standard Next.js App Router structure:

- **`src/app/`**: Contains the application's pages and layouts.
- **`src/components/`**: Contains reusable React components.
- **`src/lib/`**: Contains utility functions, including the logic for reading blog posts.
- **`src/utils/`**: Contains utility functions, including the Shopify API integration.
- **`content/blog/`**: Contains the MDX files for blog posts.
- **`public/`**: Contains static assets, such as images.

## Styling

The project uses Tailwind CSS for styling. Custom styles are defined in `tailwind.config.ts`. The project also uses `shadcn/ui` for some UI components.

## Blog

The blog is managed through local MDX files in the `content/blog` directory. Each file represents a single blog post and includes frontmatter for metadata such as the title, excerpt, date, and author. The `src/lib/blog.ts` file contains the logic for reading and parsing these files.

## Shopify Integration

The project integrates with the Shopify Storefront API to fetch product information and create checkouts. The integration logic is located in `src/utils/shopify.ts`. The `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`, `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`, and `NEXT_PUBLIC_PRODUCT_ID` environment variables must be set for the integration to work.
