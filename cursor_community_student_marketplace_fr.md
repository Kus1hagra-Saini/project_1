# Community student marketplace frontend design
_Exported on 3/25/2026 at 11:13:42 GMT+5:30 from Cursor (2.6.20)_

---

**User**

Role: You are a Senior Frontend Engineer specializing in React, Tailwind CSS, and Lucide Icons.

Task: Create a high-fidelity, responsive frontend for a "Community Student Marketplace" where students can buy, sell, or donate school items (books, uniforms, notes).

Key Features to Include:

Navbar: Logo, Search bar (global), and user profile/auth links.

Hero Section: A clear CTA for "List an Item" and "Browse Donations."

Advanced Filter Sidebar: >    - Category: (Books, Uniforms, Notes).

Price: A toggle for "Free/Donation" vs "Paid."

Location: A radius slider (e.g., 5km, 10km, 20km).

School: A searchable dropdown for specific school names.

Product Grid: Clean cards showing:

Item Image placeholder.

Price badge (Green "Free" badge for donations).

School name and Condition (New/Used).

Distance from user (e.g., "1.2 miles away").

Technical Requirements:

Use Tailwind CSS for styling (modern, clean, lots of whitespace).

Use Lucide-React for icons.

Create a Mock Data array so the UI is populated with realistic items.

Ensure the layout is mobile-responsive (sidebar becomes a drawer/modal on mobile).

Use functional components with React Hooks (useState for filters).

Visual Style: Professional, trustworthy, and accessible. Use a "Community" color palette (Soft blues or greens).

---

**Cursor**

Exploring the workspace to see what's already set up for the Community Student Marketplace.


Creating the project from scratch with React (Vite), Tailwind CSS, and Lucide React.


Creating project structure and files while npm install runs:


Removing the unused `donationOnly` state.


Summary of what’s in place for the **Community Student Marketplace** frontend:

### Project structure

- **React + Vite** with **Tailwind CSS** and **Lucide React**
- **Community palette**: soft blues (`community-*`) and greens/sage (`sage-*`) in `tailwind.config.js`
- **DM Sans** as the main font

### Implemented features

1. **Navbar**
   - Logo (“C” badge + “Community Marketplace” text, text hidden on small screens)
   - Global search bar (desktop and mobile)
   - Log in link and profile icon (Lucide `LogIn`, `User`)

2. **Hero**
   - Headline and short description
   - **List an Item** (primary) and **Browse Donations** (secondary) CTAs; “Browse Donations” sets the Free/Donation filter

3. **Advanced filter sidebar**
   - **Category**: Books, Uniforms, Notes (checkboxes with Lucide icons)
   - **Price**: toggle “Free / Donation” vs “Paid”
   - **Location**: radius buttons 5 km, 10 km, 20 km
   - **School**: searchable list (from `SCHOOLS` in mock data)
   - **Desktop**: fixed sidebar (e.g. `w-64`) on the left
   - **Mobile**: filters in a slide-in drawer opened via navbar menu and “Filters” button

4. **Product grid**
   - Cards with image placeholder, title, **price badge** (green “Free” for donations, neutral for paid), school, condition (New/Used), and distance (e.g. “1.2 miles away”) with `MapPin` icon
   - Grid is responsive (1 column on mobile, 2 on `sm`, 3 on `lg`)
   - Filtering by category, price type, radius, school, and global search

5. **Mock data** (`src/data/mockItems.js`)
   - `SCHOOLS` list and `MOCK_ITEMS` (12 items: mix of books, uniforms, notes; free and paid; various schools and distances)

### Run the app

```bash
cd "d:\MCA\Project"
npm run dev
```

Then open the URL shown in the terminal (e.g. http://localhost:5173). Use the **Filters** button or the **menu icon** on small screens to open the filter drawer.

