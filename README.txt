FRUIT STOP MODERN WEBSITE
=========================

FILES
- index.html        Home page
- products.html     Product categories
- about.html        Company story and team
- style.css         All styling and responsive layouts
- script.js         Mobile menu, scroll reveals and testimonial slider
- images/           Local, compressed WebP images, favicon and supplied PNG branding

HOW TO PREVIEW
1. Extract the ZIP file.
2. Open index.html in a modern browser.
3. For the most accurate preview, use a local web server such as VS Code Live Server.

HOW TO PUBLISH
Upload every file and the complete images folder to the public_html folder on your hosting account.

BEFORE GOING LIVE
- Confirm all phone numbers, opening hours and branch information.
- Replace the generic social-media links with Fruit Stop's exact profile URLs.
- Confirm that you have permission to publish the supplied photographs and business content.
- Update the Open Graph image URL in index.html after the site is uploaded.
- Add the exact branch street addresses if desired.

NOTES
This is a static front-end website. It does not include WordPress, online ordering, stock management, a CMS or a database.

DESIGN UPDATE
- The site now uses the supplied Fruit Stop logo.
- The interface colour palette is black, red and white.


BUSINESS HOURS / LIVE STATUS
----------------------------
The live Open now / Closed now status is calculated in script.js using the
Africa/Johannesburg time zone. To change the schedule, edit BUSINESS_HOURS in
script.js and update the visible hours in index.html and the footer text on all
pages. Current schedule:
- Monday-Friday: 08:00-18:00
- Saturday: 08:00-17:00
- Sunday: 08:00-13:00

MOBILE MENU
-----------
The menu automatically switches to a mobile drawer at 820px. The JavaScript
and CSS breakpoint values must remain the same if you change that breakpoint.
