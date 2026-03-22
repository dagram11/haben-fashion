# Changelog

All notable changes to the VTON Fashion E-commerce project are documented in this file.

---

## [2025-01-XX] - Try-On API Migration to Seedream-5-Lite

### Replicate Model Change
- **Issue:** Previous IDM-VTON model had timeout issues (502 Bad Gateway) due to long processing times (~60 seconds).
- **Files:** `src/app/api/tryon/route.ts`, `src/components/try-on-modal.tsx`, `.env`
- **Changes:**
  - **Model Switch**: Changed from `cuuupid/idm-vton` to `bytedance/seedream-5-lite`
  - **Input Format**: Updated to use `image_input` array with prompt-based generation
  - **Category-Based Prompts**: 
    - **Women**: "Make the woman in Image 1 wear the outfit from Image 2. Keep her face, body, height, the person pose, the person location in the image, the person size, background, and lighting the same..."
    - **Men**: "Make the man in Image 1 wear the outfit from Image 2. Keep his face, body, height, the person pose, the person location in the image, the person size, background, and lighting the same..."

### Async Polling Architecture
- **Issue:** Long-running HTTP requests caused 502 gateway timeouts.
- **Solution:** Implemented async polling pattern:
  - **POST /api/tryon**: Creates prediction and returns immediately with `predictionId`
  - **GET /api/tryon?predictionId=xxx**: Client polls every 3 seconds for status
  - **Response Handling**: Returns image URL when prediction succeeds
  - **Frontend**: Shows elapsed time during processing, fetches image from URL on completion

### Output Format Handling Fix
- **Issue:** `predictions.get()` returns strings directly, not objects with `.url()` method like `replicate.run()`.
- **File:** `src/app/api/tryon/route.ts`
- **Fix:** Added conditional handling for both output formats:
  ```typescript
  const outputUrl = typeof firstOutput === 'string' 
    ? firstOutput 
    : typeof firstOutput === 'object' && 'url' in firstOutput 
      ? firstOutput.url() 
      : String(firstOutput)
  ```

### Environment Configuration
- **File:** `.env`
- **Added:** `REPLICATE_API_TOKEN=<your-token-here>`

### Frontend Updates
- **File:** `src/components/try-on-modal.tsx`
- **Changes:**
  - Added polling mechanism with `pollingRef` and `timerRef` for cleanup
  - Shows elapsed time during processing (`formatTime()` helper)
  - Fetches image from URL after prediction completes
  - Proper cleanup on unmount and modal close

---

## [2025-01-XX] - Category Rename & Authentication

### Category Rename - Women/Men
- **Issue:** Rename categories from Hoodies/Trousers/Dresses to Women/Men.
- **Files:** `src/app/api/products/route.ts`, `src/components/header.tsx`, `src/components/footer.tsx`, `src/components/category-page.tsx`, `src/app/upper/page.tsx`, `src/app/lower/page.tsx`
- **Changes:**
  - **Hoodies → Women**: All women's products (dresses, gowns) now under Women category
  - **Trousers → Men**: All men's products (kurtas, tunics, shirts) now under Men category
  - **Dresses removed**: Category and all products removed
  - Products updated: cloth_type changed from "Hoodies"/"Trousers" to "Women"/"Men"
  - Navigation updated in header and footer
  - Category pages updated to use new category names
  - `/dresses` route removed

### User Authentication System
- **Issue:** Add user login/signup functionality to the site.
- **Files:** `prisma/schema.prisma`, `src/app/api/auth/*/route.ts`, `src/store/auth.ts`, `src/components/auth-modal.tsx`, `src/components/header.tsx`
- **Changes:**
  - **Database**: Extended User model with password, phone, avatar fields
  - **API Routes**:
    - `POST /api/auth/signup` - Create new user account with hashed password
    - `POST /api/auth/login` - Authenticate user with email/password
    - `GET /api/auth/session` - Check current session
  - **Auth Store**: Zustand store with persist middleware for auth state
    - User state management (user, isAuthenticated, isLoading)
    - Login/Signup/Logout functions
    - Auth modal control
  - **AuthModal Component**: Clean login/signup modal
    - Tab-like switch between Login and Signup modes
    - Email, password, name inputs with icons
    - Loading states and error handling
    - Responsive design with backdrop blur
  - **Header Integration**:
    - User icon button (opens auth modal when logged out)
    - Shows "Hi, [name]" when logged in
    - Logout button for authenticated users
    - Mobile menu includes Sign In/Sign Out options

---

## [2025-01-XX] - Product Detail & Hero Section Redesign

### Product Detail Modal - Shopify Style Redesign
- **Issue:** Previous product detail modal was too small and had layout issues, especially for viewing product images.
- **File:** `src/components/product-detail-modal.tsx`
- **Changes:**
  - Complete redesign following Shopify's Dawn theme layout
  - **Full-screen page** instead of modal overlay (scrollable page)
  - **2-column grid layout** on desktop (images left, details right)
  - **Vertical thumbnail gallery** on desktop left side (Shopify style)
  - **Horizontal thumbnail strip** at bottom on mobile
  - **Sticky product info** on desktop - stays visible while browsing images
  - **3:4 aspect ratio** main image for proper product photo display
  - **Clean typography** with medium weight titles
  - **Bordered buttons** for size/color selection
  - **"Try Online" as primary action** (moved above Add to Cart)
  - **Animated glow effect** on "Try Online" button with "NEW" badge
  - **Wishlist link** added at bottom with heart icon
  - **Divider line** after description section
  - **Max-width container** (1280px) with proper padding
  - **Navigation arrows** on main image for easy browsing
  - Close button positioned at top-right corner

### Hero Section Cleanup
- **Issue:** Remove unnecessary floating elements from hero section for cleaner look.
- **File:** `src/app/page.tsx`
- **Changes:**
  - Removed floating product card ("Try it on", product name, price, sparkles button)
  - Removed "Try-On Available" badge
  - Hero section now cleaner with just main image and floating secondary images

### Badge Text Update
- **Issue:** Update badge text from "AI-Powered Virtual Try-On" to more customer-friendly text.
- **Files:** `src/app/page.tsx`, `src/components/category-page.tsx`
- **Changes:**
  - Changed badge text from "AI-Powered Virtual Try-On" to "Personalized Shopping Experience"
  - Updated on both homepage and category pages

### Mobile Hero Section Redesign
- **Issue:** Hero section on mobile was text-heavy and needed more visual appeal.
- **File:** `src/app/page.tsx`
- **Changes:**
  - Redesigned mobile hero to match fashion e-commerce app style
  - **Hero Promo Card**: Horizontal split card with 38/62 layout (image takes majority)
  - **"Personalized Shopping Experience" badge**: Centered at top of card with black background and Zap icon
  - **"Winter Deal" headline** with discount subtext (15% off / 5% off outlet)
  - **Product image**: Large (62% width), 3:4 aspect ratio, rounded-3xl border, object-top positioning
  - **"Shop Now" button**: Black background, left-aligned, links to Women page
  - **"Watch Demo" button**: White with border, left-aligned, includes Play icon
  - **Buttons alignment**: Left-aligned using `items-start` flex property
  - **Pagination dots**: Three dots at bottom indicating carousel
  - **Removed**: Collection cards (Women, Men section)
  - **Social proof**: Compact user avatars with rating
  - **Trust badges**: Free Shipping, Secure Checkout, Easy Returns in white rounded card
  - Desktop layout preserved with original design
  - Mobile now features picture-heavy, card-based UI similar to fashion apps

---

## [2025-01-XX] - Category Navigation Simplification

### Category Structure Update
- **Issue:** Removed confusing "All" and body-part based categorization (Upper Body, Lower Body).
- **Files:** `src/components/header.tsx`, `src/components/category-page.tsx`, `src/components/product-card.tsx`, `src/components/product-detail-modal.tsx`
- **Changes:**
  - Removed "All" category from navigation
  - Navigation now shows only three clear categories: **Hoodies**, **Trousers**, **Dresses**
  - Category links:
    - Hoodies → `/upper`
    - Trousers → `/lower`
    - Dresses → `/dresses`
  - Updated both desktop and mobile navigation menus

### Product Card Category Display Fix
- **Issue:** Product cards were showing "UPPER BODY", "LOWER BODY", "DRESSES" instead of "Hoodies", "Trousers", "Dresses".
- **File:** `src/components/product-card.tsx`
- **Changes:**
  - Added `cloth_type` to Product interface
  - Changed category display from `product.category.replace('_', ' ')` to `product.cloth_type`
  - Now displays: "Hoodies", "Trousers", or "Dresses" instead of "upper body", "lower body", etc.

### Product Detail Modal Category Display Fix
- **Issue:** Product detail modal was showing "upper body", "lower body", "dresses" instead of "Hoodies", "Trousers", "Dresses".
- **File:** `src/components/product-detail-modal.tsx`
- **Changes:**
  - Added `cloth_type` to Product interface
  - Changed `categoryLabel` from `product.category.replace('_', ' ')` to `product.cloth_type`
  - Category label now displays the proper category name

### CTA Button Redirect Update
- **Issue:** "Shop Collection" and "View All" buttons were redirecting to show all products (which no longer exists).
- **File:** `src/app/page.tsx`
- **Changes:**
  - "Shop Collection" button in hero section now redirects to `/upper` (Hoodies page)
  - "View All" button in Featured Collection section now redirects to `/upper` (Hoodies page)
  - Changed from `setClothType('all')` to `window.location.href = '/upper'`

### Women Products Data Update
- **Issue:** Replace old Hoodies products with new uploaded product data.
- **File:** `src/app/api/products/route.ts`
- **Changes:**
  - Replaced old 5 Hoodies products with 10 new products from uploaded data
  - Each product now has 3 images (image_1, image_2, image_3)
  - Product IDs updated: Women (1-10), Men (11-15)
  - Featured products: Navy Velvet Evening Gown, White & Purple Floral Maxi, Black Tunic with Gold Trim, White Dress with Patterned Hem, White Gown with Emerald Accents
  - All products have sizes: XS, S, M, L, XL
  - New products include: Navy Velvet Evening Gown, White & Purple Floral Maxi, Traditional White & Red Kemis, Black Tunic with Gold Trim, White Dress with Patterned Hem, White & Purple Geometric Dress, White Maxi with Gold & Blue Trim, White Gown with Emerald Accents, Sleeveless White Dress with Teal Bands, Cream Dress with Lime Green Detail

### Men Products Data Update
- **Issue:** Replace old Trousers products with new uploaded product data.
- **File:** `src/app/api/products/route.ts`
- **Changes:**
  - Replaced old 5 Trousers products with 5 new products from uploaded male data
  - Each product has 3 images (image_1, image_2, image_3)
  - Product IDs remain: Men (11-15)
  - Featured products: White Kurta with Green Side Panel, White Tunic with Red Geometric Yoke, White Kurta with Colorful Chest Embroidery, White Linen Shirt with Black Motif
  - All products have sizes: XS, S, M, L, XL
  - New products include: White Kurta with Green Side Panel ($350), White Tunic with Red Geometric Yoke ($300), White Kurta with Colorful Chest Embroidery ($385), Emerald Green Embroidered Shirt ($300), White Linen Shirt with Black Motif ($320)

### Featured Badge Mobile Fix
- **Issue:** Featured badge was hiding product images on mobile devices.
- **File:** `src/components/product-card.tsx`
- **Changes:**
  - Added `hidden sm:block` classes to hide Featured badge on mobile devices
  - Badge now only appears on tablet and desktop screens (640px+)

### Hero Section Image Update
- **Issue:** Update hero section product showcase with new product data.
- **File:** `src/app/page.tsx`
- **Changes:**
  - Main hero image changed to White Gown with Emerald Accents (image_1)
  - Floating product card updated with correct product name and price ($450.00)
  - Floating secondary images updated with other product images from uploaded data

---

## [2025-01-XX] - UI/UX Improvements & Bug Fixes

### 1. Try-On Modal Responsive Fixes

#### Mobile Saved Photo Section Fix
- **Issue:** The "Use your saved photo?" section was overflowing outside the modal on mobile devices.
- **File:** `src/components/try-on-modal.tsx`
- **Changes:**
  - Changed layout from horizontal (`flex-row`) to vertical stack on mobile (`flex-col sm:flex-row`)
  - Reduced image size on mobile (`w-16 h-20` on mobile, `sm:w-20 sm:h-24` on desktop)
  - Centered content on mobile (`text-center sm:text-left`)
  - Stacked buttons vertically on mobile (`flex-col sm:flex-row`)
  - Reduced text and icon sizes on mobile for better fit

#### Desktop Select-Size Section Layout Fix
- **Issue:** Users had to scroll to see size selection and generate button on desktop.
- **File:** `src/components/try-on-modal.tsx`
- **Changes:**
  - Changed layout to horizontal on desktop (`flex-col lg:flex-row`)
  - Images take 50% width on desktop (`lg:w-1/2`)
  - Size selection and buttons take 50% width on desktop (`lg:w-1/2`)
  - Vertically centered the size/actions section (`justify-center`)
  - Increased modal width on desktop (`max-w-lg lg:max-w-4xl`)
  - Reduced header padding on mobile
  - Increased max-height for better visibility (`max-h-[80vh]`)

#### Button Order Change
- **Issue:** Generate Try-On button was below Change Photo button.
- **File:** `src/components/try-on-modal.tsx`
- **Changes:**
  - Moved "Generate Try-On" button above "Change Photo" button for better UX
  - Primary action is now more prominent and accessible

---

### 2. Footer Updates

#### Removed Links
- **File:** `src/components/footer.tsx`
- **Removed items:**
  - "New Arrivals" from Shop section
  - "Shipping Info" from Help section
  - "Returns" from Help section
  - "Size Guide" from Help section

#### Renamed Categories
- **File:** `src/components/footer.tsx`
- **Changes:**
  - "Upper Body" → "Women"
  - "Lower Body" → "Men"

#### Updated Links
- **File:** `src/components/footer.tsx`
- **Changes:**
  - Women → `/upper`
  - Men → `/lower`
  - Contact Us → Opens contact modal (uses `openContact` from Zustand store)

#### Social Media Links
- **File:** `src/components/footer.tsx`
- **Changes:**
  - Instagram → `https://instagram.com` (opens in new tab)
  - Twitter → `https://twitter.com` (opens in new tab)
  - Facebook → `https://facebook.com` (opens in new tab)
  - Added `target="_blank"` and `rel="noopener noreferrer"` for security

#### Copyright Year
- **File:** `src/components/footer.tsx`
- **Changes:**
  - Changed from `© 2024 VTON` to `© 2026 VTON`

#### Component Type
- **File:** `src/components/footer.tsx`
- **Changes:**
  - Added `'use client'` directive to support Zustand store interaction
  - Added `useCartStore` import for contact modal functionality

---

### 3. Category Pages Spacing Reduction

#### Hero Section
- **File:** `src/components/category-page.tsx`
- **Changes:**
  - Removed `min-h-[45vh]` - no longer forces 45% viewport height
  - Reduced padding from `py-16` to `py-8`

#### Products Grid Section
- **File:** `src/components/category-page.tsx`
- **Changes:**
  - Reduced section padding from `py-24` to `py-8`
  - Reduced section header margin from `mb-12` to `mb-6`

---

### 4. Main Page Spacing Reduction

#### Hero Section
- **File:** `src/app/page.tsx`
- **Changes:**
  - Removed `min-h-[85vh]` - no longer forces 85% viewport height
  - Removed `min-h-[75vh]` from content container
  - Reduced padding from `py-12` to `py-8 lg:py-12`
  - Reduced content spacing from `space-y-8` to `space-y-4 lg:space-y-6`
  - Removed "Scroll to explore" indicator at bottom

#### Featured Products Section
- **File:** `src/app/page.tsx`
- **Changes:**
  - Reduced padding from `py-24` to `py-8 lg:py-12`
  - Reduced header margin from `mb-12` to `mb-6 lg:mb-8`

#### All Products Section
- **File:** `src/app/page.tsx`
- **Changes:**
  - Reduced padding from `py-24` to `py-8 lg:py-12`
  - Reduced header margin from `mb-12` to `mb-6 lg:mb-8`

#### CTA Section
- **File:** `src/app/page.tsx`
- **Changes:**
  - Reduced padding from `py-24` to `py-8 lg:py-12`
  - Reduced inner padding from `p-12 lg:p-16` to `p-8 lg:p-12`

#### Features Section
- **File:** `src/app/page.tsx`
- **Changes:**
  - Reduced padding from `py-20` to `py-12 lg:py-16`
  - Reduced grid gap from `gap-12` to `gap-8 lg:gap-12`

---

## [2025-01-XX] - Mobile Hero Section Fixes

### Duplicate Hero Section Fix
- **Issue:** Mobile was showing both desktop hero content (heading, description, buttons) AND mobile hero card, creating duplicate content.
- **File:** `src/app/page.tsx`
- **Changes:**
  - Changed desktop hero grid from `grid lg:grid-cols-2` to `hidden lg:grid lg:grid-cols-2`
  - Desktop hero content is now completely hidden on mobile screens
  - Mobile now shows only the card-based hero design

### Mobile Badge Position Update
- **Issue:** Badge was inside the mobile hero card, user wanted it centered above the hero section.
- **File:** `src/app/page.tsx`
- **Changes:**
  - Moved "Personalized Shopping Experience" badge outside and above the mobile hero card
  - Badge is now centered horizontally using `flex justify-center`
  - Badge styling adjusted for mobile (`text-xs`, smaller padding)
  - Desktop badge placement unchanged (remains inside hero left content area)
  - Mobile hero card now starts directly with "Winter Deal" headline

---

## [2025-01-XX] - Product Detail Page - Shopify Dawn Theme Redesign

### Complete Page Redesign
- **Issue:** Previous product detail modal design was not matching Shopify's clean, minimal aesthetic. User wanted a more professional e-commerce look.
- **File:** `src/components/product-detail-modal.tsx`
- **Changes:**
  
  #### Layout Structure
  - **Full-page layout**: Changed from modal overlay to full-screen page (`fixed inset-0 bg-white`)
  - **Breadcrumb navigation**: Added at top with Home > Category > Product name hierarchy
  - **2-column grid on desktop**: Images on left, product info on right (`grid lg:grid-cols-2`)
  - **Single column on mobile**: Stacked layout with images above product details
  - **Max-width container**: 1280px with proper padding (`max-w-7xl mx-auto`)

  #### Images Section
  - **Vertical thumbnail gallery** (Desktop only):
    - Positioned on the left side with `w-20` width
    - Each thumbnail is `20x24` with rounded corners
    - Black border on selected image, gray border on unselected
    - Hover effect on thumbnails
  - **Main image display**:
    - `3:4 aspect ratio` for proper product photo display
    - Rounded corners with `rounded-2xl`
    - Gray background placeholder (`bg-gray-100`)
  - **Navigation arrows** (Desktop only):
    - Circular buttons with white background and shadow
    - Positioned on left/right sides of main image
    - Only visible when multiple images exist
  - **Horizontal thumbnail strip** (Mobile only):
    - Centered below main image
    - `16x20` size thumbnails
    - Same border styling as desktop vertical gallery
  - **Heart/Wishlist button**:
    - On mobile: positioned at top-right of main image
    - On desktop: positioned in product info section at bottom
    - Red fill when liked, gray outline when not

  #### Product Info Section (Sticky on Desktop)
  - **Sticky positioning**: `lg:sticky lg:top-4 lg:self-start` - product info stays visible while scrolling images on desktop
  - **Category badge**: 
    - Uppercase text with wide letter-spacing (`tracking-[0.2em]`)
    - Small font (`text-xs`)
    - Gray color (`text-gray-500`)
  - **Product title**:
    - Medium font weight (`font-medium`)
    - Size `2xl` on mobile, `3xl` on desktop
    - Black color with tight line height
  - **Price**:
    - Size `xl` with medium weight
    - Positioned below title with margin

  #### Try Online Button (Primary CTA)
  - **Animated glow effect**:
    - Gradient background: `from-violet-500 via-fuchsia-500 to-pink-500`
    - Blur effect with `blur-sm`
    - Pulsing animation with `animate-pulse`
    - Positioned behind button with negative inset
  - **Button styling**:
    - Black background with full width
    - Rounded pill shape (`rounded-full`)
    - Larger padding (`py-7`)
    - Camera icon on left
    - "NEW" badge on right with white background and black text
    - Shadow effect (`shadow-xl`)

  #### Color Selection
  - **Label**: Shows "Color: [selected color]" with font-weight change
  - **Button styling**:
    - Pill-shaped buttons (`rounded-full`)
    - `px-5 py-2.5` padding
    - Selected: Black background with white text and black border
    - Unselected: White background with black text and gray border, hover changes border to black

  #### Size Selection
  - **Label row**: Shows "Size: [selected size]" with Size Guide link
  - **Size Guide link**: 
    - Underlined with offset
    - Gray color with hover to black
  - **Button styling**:
    - Pill-shaped buttons (`rounded-full`)
    - Minimum width `48px`, height `12` (`h-12`)
    - Same selected/unselected styling as color buttons
  - **Warning message**: "Please select a size" appears in red when trying to add without selection

  #### Add to Cart Button
  - **Secondary CTA**: Positioned below Try Online button
  - **Styling**:
    - White background with black border (`border-2 border-black`)
    - Hover effect: background becomes black, text becomes white
    - ShoppingBag icon on left
    - Disabled state with reduced opacity and cursor change
  - **Validation**: Button is disabled until size is selected

  #### Accordion Sections
  - **Description accordion**:
    - Default open (`openAccordion === 'description'`)
    - Chevron icon rotates when expanded
    - Product description text with relaxed line height
  - **Shipping & Returns accordion**:
    - Free Shipping info with Truck icon
    - Easy Returns info with RotateCcw icon
    - 30-day return policy mentioned
  - **Care Instructions accordion**:
    - Bullet-point list of care instructions
    - Machine wash, tumble dry, no bleach, iron low
  - **Accordion styling**:
    - Border-bottom separators
    - `py-4` padding for clickable headers
    - Smooth chevron rotation transition

  #### Trust Badges Section
  - **Container**: Gray background (`bg-gray-50`) with rounded corners (`rounded-xl`)
  - **Badges displayed**:
    - Shield icon + "Secure Checkout"
    - Divider line
    - Truck icon + "Fast Delivery"
  - **Layout**: Centered with gap-6, small font size

  #### Wishlist (Desktop Only)
  - **Position**: Below trust badges, centered
  - **Styling**:
    - Heart icon with text
    - Text changes to "Added to Wishlist" when liked
    - Red color when liked, gray when not

  #### Close Button
  - **Fixed positioning**: `fixed top-4 right-4 z-50`
  - **Styling**: White background, rounded full, shadow and border
  - **Icon**: X icon in gray color

### Mobile Sticky Image Fix
- **Issue:** On mobile, when scrolling, the main product image was sticky and overlapping/hiding the thumbnail images below it.
- **File:** `src/components/product-detail-modal.tsx`
- **Changes:**
  - Changed main image container from `sticky top-4` to `lg:sticky lg:top-4`
  - Sticky behavior now only applies on large screens (desktop)
  - On mobile, the main image scrolls naturally with the page
  - Thumbnails are now properly visible when scrolling on mobile devices

### Product State Reset on Product Change
- **Issue:** When closing a product detail page while viewing the 3rd image, then opening a new product, the image shown was still the 3rd instead of the first image.
- **File:** `src/components/product-detail-modal.tsx`
- **Changes:**
  - Added `useRef` to track previous product ID (`prevProductIdRef`)
  - Implemented state reset logic when product ID changes
  - **States reset when switching products:**
    - `currentImage` → resets to `0` (first image)
    - `selectedSize` → resets to empty string
    - `selectedColor` → resets to empty string
    - `isLiked` → resets to `false`
    - `openAccordion` → resets to `'description'`
  - Uses synchronous state reset during render (before early return) to avoid React's cascading render warnings

### Navigation Arrows - Mobile & Desktop
- **Issue:** Navigation arrows for browsing product images were only visible on desktop, not on mobile devices.
- **File:** `src/components/product-detail-modal.tsx`
- **Changes:**
  - Removed `hidden lg:flex` classes from navigation arrow buttons
  - Changed to `flex` so arrows are always visible on all devices
  - **Mobile arrow sizing**: `w-10 h-10` (40px)
  - **Desktop arrow sizing**: `lg:w-12 lg:h-12` (48px)
  - **Mobile positioning**: `left-2` and `right-2` (closer to edges)
  - **Desktop positioning**: `lg:left-4` and `lg:right-4` (more spacing)
  - Circular white buttons with shadow for visibility over images
  - Clicking arrows cycles through images (wraps around at start/end)

### Heart/Wishlist Button - Mobile & Desktop
- **Issue:** Heart button for wishlist was only visible on mobile, not on desktop.
- **File:** `src/components/product-detail-modal.tsx`
- **Changes:**
  - Removed `lg:hidden` class from heart button
  - Heart button now visible on both mobile and desktop
  - Positioned at top-right corner of main image
  - Shows filled red heart when liked, gray outline when not liked
  - Desktop also has additional wishlist text link at bottom of product info

### Product Card Hover Effect - Shopify Style
- **Issue:** Product cards needed a hover effect to show alternate product images, similar to Shopify stores.
- **File:** `src/components/product-card.tsx`
- **Changes:**
  - Added secondary image that appears on hover with smooth crossfade transition
  - **Implementation:**
    - Both images stacked in same container using absolute positioning
    - Primary image (`image_1`) visible by default
    - Secondary image (`image_2`) fades in on hover with `opacity` transition
    - Secondary image scales up slightly (`scale-105`) for dynamic effect
    - Transition duration: `500ms` for smooth animation
  - **Conditional rendering:** Only applies hover effect if product has a second image (`hasSecondImage`)
  - **Fallback:** Products without a second image retain original scale-on-hover effect
  - Lighter overlay (`bg-black/5`) for subtle visual feedback
  - Matches Shopify Dawn theme behavior for product cards

---

## Files Modified

1. `src/components/header.tsx` - Removed "All" category from navigation, added auth integration
2. `src/components/category-page.tsx` - Updated categories array
3. `src/components/product-card.tsx` - Changed category display to use `cloth_type` instead of `category`
4. `src/components/product-detail-modal.tsx` - Changed category label to use `cloth_type`, redesigned to Shopify-style full-page layout
5. `src/app/page.tsx` - Updated CTA buttons, redesigned mobile hero section, added AuthModal
6. `src/app/api/products/route.ts` - Replaced products with new uploaded data, renamed categories
7. `src/components/try-on-modal.tsx` - Try-on modal responsive layout, async polling for seedream-5-lite
8. `src/components/footer.tsx` - Footer links, names, and copyright
9. `prisma/schema.prisma` - Extended User model for authentication
10. `src/app/api/auth/signup/route.ts` - User signup API
11. `src/app/api/auth/login/route.ts` - User login API
12. `src/app/api/auth/session/route.ts` - Session check API
13. `src/store/auth.ts` - Auth state management with Zustand
14. `src/components/auth-modal.tsx` - Login/signup modal component
15. `src/app/api/tryon/route.ts` - Migrated to bytedance/seedream-5-lite with async polling
16. `.env` - Added REPLICATE_API_TOKEN

---

## Summary

This update focused on improving the user experience across all devices:
- **Category Navigation** simplified from Hoodies/Trousers/Dresses to Women/Men
- **Product Cards** now show second image on hover (Shopify style crossfade effect)
- **Product Cards & Modal** now display proper category names
- **Product Detail Page** completely redesigned with Shopify Dawn theme:
  - Full-page layout with breadcrumb navigation
  - Vertical thumbnail gallery on desktop (left side)
  - Horizontal thumbnail strip on mobile (below main image)
  - Sticky product info on desktop
  - Animated glow effect on "Try Online" button
  - Accordion sections for Description, Shipping, and Care
  - Trust badges and wishlist functionality
  - Pill-shaped buttons for size/color selection
  - **Navigation arrows** now visible on both mobile and desktop
  - **Heart button** now visible on both mobile and desktop
  - **State reset** when switching products (image index, size, color, wishlist, accordion)
- **Mobile Hero** redesigned with card-based, picture-heavy UI matching fashion e-commerce apps
- **Mobile Hero Fix** resolved duplicate content issue - desktop hero now properly hidden on mobile
- **Mobile Badge** repositioned above hero section, centered for better visibility
- **Mobile Product Detail Fix** sticky image no longer overlaps thumbnails on scroll
- **User Authentication** added with login/signup functionality, persistent auth state
- **Mobile users** have properly formatted try-on modals without overflow issues
- **Desktop users** can see all try-on options without scrolling
- **All users** benefit from reduced spacing, making content more accessible
- **Footer** is cleaner with only essential links and proper external social media links
- **Try-On API** migrated from IDM-VTON to bytedance/seedream-5-lite with async polling to fix 502 timeout errors
