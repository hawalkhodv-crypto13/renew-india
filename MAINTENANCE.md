# Renew India content and calculator maintenance

Buildless static site. Vehicle data lives in `vehicle-catalogue.json`; all prices are INR. `priceMin` drives the budget ceiling and default on-road input. Price notes must disclose included incentives, battery-rental plans and geography. Do not remove those notes when updating prices.

Rebuild in this order:

```
python scripts/build-catalogue.py
python scripts/build-solar.py
python scripts/finalize-pages.py
```

Run the checks after changing content or calculation rules:

```
node tests/navigation.cjs
node tests/calculations.cjs
node tests/calculator-ui.cjs
node tests/interactions.cjs
python tests/check-site.py
```

`dist/navigation.js` must load synchronously at the start of head. Normal internal links explicitly use `_self`; modified clicks retain browser behaviour. Avoid a second routing handler or `window.open` for internal navigation. `finalize-pages.py` maintains old savings URLs and links.

`dist/calculations.js` contains pure math; `dist/calculators.js` renders the UI. Road-tax sources and checked policy end dates live in `dist/road-rules.js`. Unknown road tax returns null, never zero. Insurance zero means missing, not free. Commercial autos always show an incomplete subtotal because fitness/classification and local statutory fees need confirmation. Karnataka supplemental statutory fees remain unconfirmed and its result is labelled subtotal. All charges are estimates until a dealer/RTO confirms the invoice basis. Do not model petrol taxes for electric autos.

Source review date: 14 October 2026. State tax rules, subsidy deadlines and approved model lists require fresh checks before changing that date. The cited Karnataka 2026 amendment supersedes the older below-₹25-lakh exemption. PM E-DRIVE e2W dates differ from L5 and low-speed e-rickshaw dates. The listed autos are L5 passenger vehicles. State purchase incentives are not automatically deducted. Never infer model subsidy approval solely from catalogue category or ex-showroom price.

Rooftop presets are examples, not inferred facts about the user. Defaults use 5 equivalent peak-sun-hours and 80% performance, not six guaranteed generating hours. Direct consumption is capped by annual household consumption; export energy cannot also count as directly avoided grid purchases. Export credit starts at zero. Subsidy affects capital cost only after the user selects conditional eligibility. The grant model is for a new residential installation; extensions and prior grants need separate checks.

Browser visual QA was unavailable in this managed environment. Automated checks cover calculations, calculator events, navigation event behaviour, filters, galleries and local routes/assets. They do not prove behaviour of external browser extensions or host-frame link interception.
