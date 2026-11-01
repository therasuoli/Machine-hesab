# Professional Calculator
Created for Hadi Rasouli.

## Run
Open `index.html` directly for basic use. For full PWA installation and service-worker offline caching, serve this folder from localhost or HTTPS (for example, `python -m http.server 8000`).

## Included
- Persian, Turkish, English and Arabic interface labels with RTL/LTR switching
- Basic and scientific expression pad, history and local persistence
- Profit/loss, discount, VAT, installment and investment calculations
- Toman/rial, quantity, area, BMI, fuel, currency-rate example, random, fraction and programmer tools
- Unit conversions, themes, export JSON, keyboard shortcuts and PWA cache
- No analytics or external JavaScript dependencies

## Notes
This is a runnable starter implementation. Some advanced items from the original specification (full Jalali/Hijri calendar algorithms, robust natural-language parsing, currency API refresh, advanced programmer bitwise UI, drag/drop favorites, share-as-image, notification scheduling, learning mode and complete translation coverage for every dynamic message) are not yet implemented. The exchange-rate values in the offline currency converter are editable in `app.js` and are illustrative defaults, not live rates.
