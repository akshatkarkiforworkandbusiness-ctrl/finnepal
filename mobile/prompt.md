Create a complete, high-fidelity native mobile application prototype called “ORBIT” for a Nepal-focused fintech and financial-inclusion platform.

IMPORTANT PRODUCT CONTEXT

ORBIT is not a bank, wallet, or payment provider. It is a secure, user-controlled financial aggregation and financial-inclusion platform.

The target users are underserved people in Nepal, especially:
- Women entrepreneurs
- Informal-sector businesses
- Gig workers
- Farmers and small producers
- Micro and small business owners

The core problem is that users may already have financial activity spread across:
- Bank accounts
- Digital wallets
- Digital payment platforms
- Cash
- Business income
- Business expenses
- Savings
- Informal credit/debt
- Insurance

Their financial activity is fragmented, difficult to understand, and difficult to use as a trustworthy financial profile when seeking formal financial services.

ORBIT solves this by allowing users to explicitly choose and securely connect financial providers, consolidate permitted financial information, understand their financial health, create a Financial Passport, manage savings, understand credit readiness, discover insurance opportunities, and receive security/fraud alerts.

The key product statement is:

“Your money is everywhere. Your financial identity should be in one place.”

ORBIT tagline:

“Connect. Understand. Grow.”

Do NOT design ORBIT as another generic banking app.

The main innovation is the combination of:
1. User-controlled financial connections
2. Unified financial dashboard
3. Financial Health insights
4. Financial Passport
5. Financial opportunity discovery
6. Strong consent and security controls

The application must feel like a serious startup product that could be demonstrated at a major fintech innovation hackathon in Nepal.

TECHNOLOGY

Build the prototype as a native mobile application using:

- React Native
- Expo
- Expo Go compatible architecture
- TypeScript
- React Navigation
- Functional components
- Reusable components
- Local mock data for the prototype
- AsyncStorage for local demo persistence where appropriate
- No requirement for a real backend
- No requirement for production payment credentials
- Simulate external provider connections using realistic sandbox/demo flows

The prototype must be runnable through Expo Go.

Do not create a web application.

This is a MOBILE-FIRST NATIVE APPLICATION.

DESIGN LANGUAGE

Use ONLY these two brand colors:

Deep Forest Green:
#0B3D2E

Deep Red:
#C5161D

IMPORTANT:
#C5161D is deep red, not green.

Use Deep Forest Green as the dominant brand color.

Use Deep Red selectively for:
- Important actions
- Alerts
- Fraud warnings
- Selected states where appropriate
- Important financial opportunities
- Key CTAs when emphasis is needed

Use white and neutral shades only as functional UI surfaces/backgrounds/text contrast. Do not introduce additional brand colors such as blue, purple, orange, cyan, or gradients.

The interface should feel:
- Premium
- Minimal
- Trustworthy
- Financial
- Modern
- Clean
- Calm
- Highly usable
- Nepal-focused
- Accessible to users with low digital literacy

Avoid:
- Excessive gradients
- Glassmorphism
- Excessive shadows
- Neon colors
- Overly futuristic crypto aesthetics
- Clutter
- Tiny text
- Excessive animations
- Generic banking templates

Use:
- Rounded cards
- Generous spacing
- Clear typography
- Strong hierarchy
- Large numbers for financial information
- Simple icons
- Soft elevation
- Clean bottom navigation
- Clear status indicators
- Large touch targets
- Accessible contrast
- Consistent 8pt spacing system

Use modern fintech-style UI but make it distinctly ORBIT.

BRAND IDENTITY

App name:
ORBIT

Logo concept:
A minimal circular orbit symbol combined with a subtle financial/connection concept.

The logo should communicate:
- Connection
- Movement
- Financial ecosystem
- Trust
- Growth

Use the Deep Forest Green logo on light surfaces and white logo on green surfaces.

Splash screen:
Deep Forest Green background.
Centered ORBIT logo.
ORBIT wordmark.
Small tagline:
“Connect. Understand. Grow.”

Keep splash screen minimal.

ONBOARDING

Create a polished onboarding experience with 3–4 screens.

Screen 1:
Title:
“Your money is everywhere.”

Description:
“Banks, wallets, cash, business income and expenses can be difficult to manage separately.”

Visual:
Simple orbit-style illustration showing multiple financial sources moving around a central ORBIT.

Screen 2:
Title:
“One financial view.”

Description:
“Connect the accounts and services you choose and understand your financial life in one place.”

Visual:
Connected financial nodes flowing into ORBIT.

Screen 3:
Title:
“Your data. Your choice.”

Description:
“ORBIT only accesses what you authorize. You can review permissions and disconnect providers anytime.”

Visual:
Shield + connection icon.

Screen 4:
Title:
“Turn activity into opportunity.”

Description:
“Build your Financial Passport, understand your financial health, and discover savings, credit and insurance opportunities.”

CTA:
“Get Started”

SECONDARY CTA:
“Learn how ORBIT protects your data”

LANGUAGE

Design the application to support:
- English
- नेपाली

Add a language selector during onboarding and in Settings.

The prototype can initially display English throughout the main screens, but the architecture and UI should make localization possible.

For selected important screens, demonstrate Nepali copy where appropriate.

AUTHENTICATION

Create a polished authentication flow.

Screens:
1. Welcome
2. Phone number
3. OTP verification
4. Create PIN
5. Biometric setup
6. Profile setup

Do not ask for unnecessary information.

Profile setup:
- Full name
- User type
- Location
- Primary financial goal

User types:
- Small business owner
- Women entrepreneur
- Farmer
- Gig worker
- Salaried individual
- Other

Financial goals:
- Grow my business
- Save money
- Access credit
- Protect my income
- Manage expenses
- Understand my finances

Allow skipping optional information.

HOME DASHBOARD

This is the primary screen.

Create a premium fintech dashboard.

Header:
“Good morning, Maya 👋”

Below:
“Here’s your financial orbit.”

Main Financial Health card:

FINANCIAL HEALTH
78 / 100

Status:
“Healthy”

Include a simple circular progress indicator using Deep Forest Green.

Below show a short explanation:
“Your income is stable and your savings are improving.”

Do not overcomplicate the score.

SUMMARY CARDS

Income:
Rs. 86,400
+12% this month

Expenses:
Rs. 52,300
-4% this month

Savings:
Rs. 14,200
+8% this month

Digital payments:
Rs. 63,800

Use simple icons and clean typography.

CASH FLOW SECTION

Title:
“Cash flow”

Show a simple 7-day or monthly bar/line visualization.

Use only Deep Forest Green and Deep Red.

Green represents positive/income.
Red represents negative/expense.

Do not introduce other chart colors.

RECENT ACTIVITY

Show examples:

eSewa
Customer payment
+Rs. 2,500

Khalti
Supplier payment
-Rs. 1,500

Nabil Bank
Salary/business income
+Rs. 12,000

Cash
Business expense
-Rs. 800

Each transaction should have:
- Provider
- Category
- Date
- Amount
- Income/expense indicator

FINANCIAL OPPORTUNITIES

Card:
“Your Financial Passport is ready”

Progress:
82%

CTA:
“View Passport”

Another card:
“Build your emergency fund”

Progress:
Rs. 35,000 / Rs. 100,000

Another:
“You may be ready to explore business financing”

CTA:
“Explore options”

SECURITY ALERT

If there is a simulated suspicious transaction:

Red alert card:
“Suspicious activity detected”

“Rs. 18,500 transaction from a new recipient.”

Buttons:
“Review”
“Not me”

Do not claim AI fraud detection.
Use simple rule-based mock detection in the prototype.

BOTTOM NAVIGATION

Use 5 primary tabs:

Home
Money
Passport
Opportunities
Profile

Use simple line icons.

Selected tab:
Deep Forest Green.

Avoid excessive navigation complexity.

MONEY SCREEN

Title:
“Your Money”

Create tabs:
Overview
Transactions
Connections

OVERVIEW

Show:
Total balance
Income
Expenses
Savings
Debt

Use clear financial hierarchy.

TRANSACTIONS

Create a searchable transaction list.

Filters:
All
Income
Expenses
Payments
Transfers

Categories:
Food
Business
Transport
Suppliers
Utilities
Savings
Other

Each transaction should show:
Provider
Description
Category
Date
Amount

Allow tapping a transaction for details.

TRANSACTION DETAIL

Show:
Amount
Provider
Date
Time
Status
Transaction ID
Category
Notes

Security section:
“Source verified”

Do not expose sensitive credentials.

CONNECTIONS SCREEN

This is one of the most important screens in the entire application.

Title:
“Connect your financial life”

Subtitle:
“You choose what ORBIT can access.”

Create provider categories.

BANK ACCOUNTS

Card:
“Connect a Bank”

Description:
“Securely connect a supported bank account.”

Button:
“Connect Bank”

When tapped:
Show bank selection screen.

Include example banks:
Nabil Bank
Global IME Bank
NIC Asia
NMB Bank
Himalayan Bank
Nepal Bank
Other supported bank

Do not claim that all banks are actually integrated.

For the prototype, selecting a bank should launch a simulated secure authorization flow.

DIGITAL WALLETS

Cards:
eSewa
Khalti

Each:
Provider logo/icon
Description
Connection status
Connect button

PAYMENT NETWORKS

connectIPS
Fonepay / QR where supported

Show:
“Provider availability depends on authorized API access.”

BUSINESS PAYMENTS

Stripe

Description:
“For businesses receiving online/international payments.”

Connect button.

CASH

“Add cash manually”

Description:
“Track cash income and expenses that cannot be connected digitally.”

CONNECTION AUTHORIZATION FLOW

This is critical.

When user taps Connect eSewa:

Screen:
“Connect eSewa”

Show provider logo.

Heading:
“Review permissions”

Description:
“ORBIT will only access the information you approve.”

Permissions:

✓ Transaction history
✓ Transaction amount
✓ Transaction date
✓ Transaction status

Not allowed:

✕ Password
✕ MPIN
✕ OTP
✕ Card CVV

CTA:
“Continue securely”

Secondary:
“Cancel”

Then show simulated provider authorization screen.

Never ask users to enter real passwords, MPINs, OTPs or card details into ORBIT.

Simulate provider authorization.

After authorization:
“eSewa connected successfully.”

Show:
Connection date
Last synced
Permissions

Button:
“Manage connection”

FINANCIAL PASSPORT

This is the central differentiating feature.

Create a premium passport screen.

Header:
“Financial Passport”

Subtitle:
“A simple view of your financial activity.”

Show profile identity:
Maya Sharma
Small Business Owner
Lalitpur, Nepal

Verification status:
“Profile verified”

FINANCIAL PROFILE SCORE

81 / 100

Label:
“Strong financial activity”

Do NOT call this a formal credit score.

Use:
“Financial Activity Score”

Show transparent indicators:

Income consistency
86%

Savings behavior
72%

Digital payment activity
High

Repayment behavior
94%

Business activity
2.5 years

Financial records
82% complete

Add:
“How is this calculated?”

This opens a transparent explanation screen.

Explain:
“ORBIT does not decide whether you deserve a loan. This profile summarizes your user-authorized financial activity so you can understand it and share it with participating financial providers.”

Add:
“Share Passport”

Allow simulated sharing.

SHARE PASSPORT FLOW

Screen:
“Share your Financial Passport”

Choose recipient:
Bank
Microfinance
Cooperative
Insurance provider

Data permissions:

✓ Financial activity summary
✓ Income consistency
✓ Savings behavior
✓ Repayment history

Optional:
Account numbers should NOT be shared by default.

CTA:
“Share securely”

Show consent confirmation.

CREDIT / FINANCING

Under Opportunities, create:

“Financing”

Headline:
“Understand your financing readiness.”

Show:
Financial activity:
Strong

Income consistency:
Good

Existing obligations:
Moderate

Records:
Complete

Financing readiness:
78%

Do not say:
“You are approved.”

Instead:
“You may be ready to explore financing.”

Show example options:

Working Capital
Up to Rs. 100,000
“Based on your financial profile”
CTA:
“Learn more”

Equipment Financing
Up to Rs. 150,000
CTA:
“Learn more”

Include disclaimer:
“ORBIT does not approve or provide loans. Final decisions are made by participating financial institutions.”

SAVINGS

Create a dedicated Savings screen.

Header:
“Build your savings”

Show current savings:
Rs. 14,200

Goals:

Emergency Fund
Rs. 35,000 / Rs. 100,000
14% progress

Business Equipment
Rs. 20,000 / Rs. 50,000
40% progress

Education
Rs. 45,000 / Rs. 75,000
60% progress

CTA:
“Create savings goal”

For each goal show:
Target
Current
Monthly contribution
Estimated completion

Use simple language.

INSURANCE

Create:
“Protect what you earn.”

Show recommended categories:

Health protection
“Protect yourself from unexpected medical costs.”

Business protection
“Protect your business from selected disruptions.”

Income protection
“For people depending on one primary income source.”

Each card:
Simple explanation
Estimated example premium
“Explore”

Do not present fake insurance policies as real.
Clearly mark them as:
“Demo recommendation”

FRAUD / SECURITY CENTER

Create a dedicated Security screen.

Header:
“Your security”

Security score:
“Protected”

Sections:

Connected accounts
3 active

Recent security activity
- eSewa synced
- Khalti connected
- New device login

Suspicious activity
1 alert

SECURITY ALERT SCREEN

Show:
“Was this transaction yours?”

Amount:
Rs. 18,500

Provider:
eSewa

Recipient:
Unknown recipient

Status:
Unusual activity

Buttons:
“Yes, it was me”
“No, secure my account”

If “No”:
Show:
“Connection temporarily restricted”
“Review your connected accounts.”

Again, this is a prototype simulation.

PRIVACY CENTER

This must be one of the strongest screens.

Title:
“Privacy & permissions”

Description:
“You are in control of your financial data.”

Show each provider.

eSewa
Connected
Transaction history
Active

Khalti
Connected
Transaction history
Active

Nabil Bank
Connected
Transaction history
Active

For every provider:
View permissions
Change permissions
Disconnect

Add:
“Disconnect all”

DATA ACCESS EXPLANATION

Create:
“What does ORBIT access?”

Explain clearly:

ORBIT may access:
- Approved transaction information
- Approved account information
- Approved financial activity

ORBIT never asks for:
- Banking passwords
- Wallet MPIN
- OTP
- Card CVV

Use a prominent security illustration.

SETTINGS

Sections:

Profile
Language
Security
Biometric login
PIN
Notifications
Privacy & permissions
Connected accounts
Help
Terms
About ORBIT
Log out

PROFILE

Show:
Name
Phone
Email
User type
Location
Primary financial goal

Allow edit.

NOTIFICATIONS

Types:
Transaction alerts
Security alerts
Savings reminders
Financial insights
Opportunity notifications

Allow toggles.

BIOMETRIC

Show:
“Use biometric login”

Toggle.

PIN:
Change PIN

APP LOCK:
Enable after inactivity

DEMO DATA

Create realistic Nepal-specific demo data.

User:
Maya Sharma

Age:
29

Location:
Lalitpur, Nepal

Occupation:
Home-based food entrepreneur

Income:
Rs. 86,400/month

Expenses:
Rs. 52,300/month

Savings:
Rs. 14,200

Outstanding obligations:
Rs. 31,000

Use Nepalese Rupees everywhere.

Use:
Rs.

Do not use:
$
USD
EUR

TRANSACTIONS

Create at least 20 realistic demo transactions across:

eSewa
Khalti
Nabil Bank
Cash

Examples:
Customer payment
Supplier payment
Business supplies
Transport
Utilities
Savings
Food
Rent
Business income

Make the dashboard feel alive and realistic.

USER EXPERIENCE

The application should be extremely simple for users with low digital literacy.

Use:
- Large touch targets
- Clear labels
- Simple wording
- Icons with text
- Helpful explanations
- Minimal financial jargon

When jargon is necessary, provide:
“Learn more”

Never use complicated terminology without explanation.

ACCESSIBILITY

Support:
- Large text
- High contrast
- Screen reader friendly labels
- Minimum 44px touch targets
- Clear error messages
- No information conveyed by color alone

NAVIGATION

Use React Navigation.

Stack:
Splash
Onboarding
Authentication
Main App

Main tabs:
Home
Money
Passport
Opportunities
Profile

Nested stacks for:
Connections
Transaction Details
Security
Settings
Privacy
Credit
Savings
Insurance

ANIMATIONS

Use subtle, premium animations:
- Splash fade
- Card entrance
- Number count-up
- Progress animations
- Bottom sheet transitions
- Connection success animation

Do not over-animate.

Keep the application fast.

ERROR STATES

Design:
- No connection
- Connection failed
- Provider unavailable
- Sync failed
- Network unavailable
- Empty transactions
- Permission denied

Example:
“Unable to connect right now.”
“Your data has not been changed.”

Add:
“Try again”

LOADING STATES

Use skeleton loaders for:
Dashboard
Transactions
Passport
Connections

Do not use generic spinning loaders everywhere.

EMPTY STATES

If no accounts are connected:

“Your financial orbit is waiting.”

“Connect your first account to see your financial activity in one place.”

CTA:
“Connect account”

SECURITY ARCHITECTURE VISUALIZATION

Include an in-app educational screen:

“Built around your consent”

Flow:

You choose provider
↓
You review permissions
↓
Provider authorizes access
↓
ORBIT receives permitted data
↓
You can revoke access anytime

Explain:
“ORBIT does not need your banking password or wallet MPIN.”

TECHNICAL MOCK ARCHITECTURE

Structure the code so provider integrations can later use adapters:

PaymentProvider
- EsewaAdapter
- KhaltiAdapter
- BankAdapter
- ConnectIPSAdapter
- FonepayAdapter
- StripeAdapter

For the prototype, implement mock adapters.

Use a normalized transaction structure:

id
provider
type
amount
currency
category
description
timestamp
status
reference
verified

Use local mock data.

Create a Connection model:

provider
status
permissions
lastSynced
connectedAt

Create Financial Passport model:

incomeConsistency
savingsBehavior
paymentActivity
repaymentBehavior
financialRecordCompleteness
businessActivityDuration

Never store real financial credentials in the prototype.

Never ask for:
Bank password
Wallet password
MPIN
OTP
Card CVV

BUSINESS MODEL

The UI should subtly support the business model.

ORBIT is free for the basic underserved user.

Potential paying customers:
- Banks
- Microfinance institutions
- Cooperatives
- Insurance providers
- Financial service providers

Potential revenue:
- B2B API/subscription
- Qualified financial-product referral partnerships where legally permitted
- Premium business-management features

Do not show aggressive advertising.

Add an optional screen:
“Financial partners”

Explain:
“Participating financial institutions can offer relevant services based on user consent.”

MARKET POSITIONING

The prototype should communicate:

ORBIT does not replace:
eSewa
Khalti
Banks
connectIPS
Insurance providers

ORBIT connects the user's financial experience across supported providers.

The positioning:

“Your financial life is fragmented. ORBIT brings the parts you choose into one understandable view.”

Do not claim universal integration.

Use labels:
“Available”
“Demo”
“Coming soon”
“Partner integration”

where appropriate.

HACKATHON DEMO FLOW

The prototype must support a smooth 3–5 minute demo.

Demo journey:

1. Open ORBIT
2. See onboarding
3. Create Maya's account
4. Open Home
5. See fragmented financial activity consolidated
6. Open Connections
7. Connect eSewa using simulated authorization
8. Connect Khalti using simulated authorization
9. Return to dashboard
10. Show updated transactions
11. Open Financial Passport
12. Explain Financial Activity Score
13. Open Financing opportunity
14. Open Savings goal
15. Show Insurance opportunity
16. Trigger simulated suspicious transaction
17. Open Security Center
18. Show Privacy & Permissions
19. Disconnect one provider
20. Show that the user remains in control

Make every demo step clickable and functional.

NO DEAD-END BUTTONS.

If a button represents a future integration, show a clear demo modal rather than doing nothing.

VISUAL DETAILS

Use a consistent design system.

Colors:
Primary:
#0B3D2E

Secondary:
#C5161D

Neutral:
White
Very light neutral surfaces
Dark neutral text

Do not introduce any other accent colors.

Use green for:
Positive financial state
Connected status
Primary brand actions

Use red for:
Critical alerts
Fraud warnings
Important attention states

Do not use red everywhere.

Typography:
Modern geometric/sans-serif.
Strong large financial numbers.
Readable body text.
Medium-weight labels.
High visual hierarchy.

Cards:
12–20px radius.
Soft shadow.
Clean borders.

Buttons:
Large.
Rounded.
Strong contrast.
Clear action labels.

ICONOGRAPHY

Use simple outline icons.

Suggested icons:
Home
Wallet
Bank
Credit Card
Shield
Lock
Arrow Up
Arrow Down
Chart
Target
Insurance
User
Settings
Link
Unlink
Eye
Eye Off
Check
Alert
Bell

Keep icons consistent.

DO NOT use random emoji as the primary interface iconography.

Use emojis only if they genuinely improve a specific empty state or onboarding message.

LOGO

Create a simple ORBIT logo:
A circular orbit ring with a small central dot or financial node.

It should be recognizable even at 24px.

Do not create a complicated logo.

MOBILE SCREEN SIZES

Design for:
iPhone 15 / 16 style dimensions
Android modern phone dimensions

Make everything responsive.

Use SafeAreaView.

Handle:
Notch
Status bar
Bottom gesture area

Do not place critical controls behind system UI.

FINAL REQUIRED SCREENS

The prototype must include at minimum:

1. Splash
2. Onboarding 1
3. Onboarding 2
4. Onboarding 3
5. Login
6. OTP
7. Profile setup
8. Home dashboard
9. Money overview
10. Transactions
11. Transaction detail
12. Connections
13. Bank selection
14. Provider authorization
15. Connection success
16. Financial Passport
17. Passport explanation
18. Share Passport
19. Opportunities
20. Credit/financing
21. Savings
22. Insurance
23. Security center
24. Fraud alert
25. Privacy & permissions
26. Provider permissions
27. Settings
28. Profile
29. Notifications
30. Security settings
31. Empty state
32. Error state
33. Sync state

FINAL DESIGN GOAL

The application should look like a serious fintech startup prototype, not a student CRUD application.

The visual hierarchy should immediately communicate:

CONNECT
↓
UNDERSTAND
↓
BUILD FINANCIAL PASSPORT
↓
ACCESS OPPORTUNITIES
↓
STAY PROTECTED

The first impression should be:
“Premium, trustworthy, simple, Nepal-focused fintech.”

The user should understand the product within 10 seconds.

The judges should immediately understand that ORBIT is designed around:
- Financial inclusion
- User consent
- Digital payments
- Financial literacy
- Financial trust
- Credit readiness
- Savings
- Insurance
- Fraud protection

Do not overcomplicate the MVP.

The prototype must prioritize a polished, coherent end-to-end user journey over hundreds of disconnected features.

Make all screens visually consistent.

Use realistic Nepalese financial examples and NPR amounts.

Build the entire prototype as a native Expo-compatible React Native TypeScript application.