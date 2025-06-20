# Salute to Troops

Welcome to the Salute to Troops project! This is a unique event marketing platform dedicated to fostering collaboration between Academia, Industry, and the Military. Our mission is to drive innovation, build community, and assist the military in overcoming historic challenges related to recruitment, retention, and reintegration by creating impactful narratives.

This application is built with Next.js, TypeScript, and Tailwind CSS, featuring a dynamic landing page with a newsletter subscription form.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Animations**: [Motion](https://motion.dev/)
-   **Newsletter Backend**: [Airtable](https://airtable.com/)
-   **Spam Protection**: [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/)
-   **Analytics**: [Vercel Analytics](https://vercel.com/analytics), Google Analytics, Meta Pixel

## Project Structure

The project follows the standard Next.js App Router structure:

```
.
├── app/
│   ├── api/            # API routes
│   │   └── newsletter/
│   │       └── route.ts  # Handles newsletter subscriptions
│   ├── components/     # Reusable React components
│   │   ├── BackgroundVideo.tsx
│   │   ├── Footer.tsx
│   │   ├── Modal.tsx
│   │   ├── Navbar.tsx
│   │   └── Newsletter.tsx
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Main landing page
│   └── globals.css     # Global styles
├── public/             # Static assets
└── ...                 # Configuration files
```

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   Node.js (v20 or later)
-   npm, yarn, or pnpm

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/your-username/next-salutetotroops.git
cd next-salutetotroops
```

### 2. Install Dependencies

Install the project dependencies using npm:

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root of the project by copying the example file:

```bash
cp .env.local.example .env.local
```

Now, open `.env.local` and add your credentials for Airtable and Cloudflare Turnstile.

```env
# .env.local

# Airtable Credentials
# Get these from your Airtable account settings and base.
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_airtable_base_id

# Cloudflare Turnstile Credentials
# Get these from your Cloudflare dashboard.
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key
TURNSTILE_SECRET_KEY=your_turnstile_secret_key
```

### 4. Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## GitHub Workflow: Contributing

We use a standard Git workflow with feature branches and pull requests.

### 1. Create a Branch

Before you start working on a new feature or bug fix, make sure your `main` branch is up-to-date and create a new branch from it.

```bash
# Switch to the main branch
git checkout main

# Pull the latest changes
git pull origin main

# Create a new feature branch
git checkout -b feature/your-feature-name
```

Use a descriptive branch name, such as `feature/add-contact-form` or `fix/navbar-layout`.

### 2. Make and Commit Changes

Make your code changes. Once you are ready to commit, stage and commit your files with a clear commit message.

```bash
# Stage all changes
git add .

# Commit your changes
git commit -m "feat: Add contact form component"
```

### 3. Push Your Branch

Push your new branch to the remote repository on GitHub:

```bash
git push origin feature/your-feature-name
```

### 4. Create a Pull Request (PR)

1.  Go to the repository on GitHub.
2.  You will see a prompt to create a pull request from your recently pushed branch. Click on it.
3.  Set the base branch to `main`.
4.  Add a descriptive title and a clear description of the changes you've made.
5.  Click "Create Pull Request".

### 5. Review and Merge

Once the PR is created, it will be reviewed by other team members. After approval and passing any automated checks, the branch will be merged into `main`.