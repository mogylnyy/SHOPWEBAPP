# **App Name**: QuickBuy TG

## Core Features:

- Main Menu: Display four large, clearly labeled buttons on the main page: Shop, Profile, Top-Up Balance, Help
- Product Categories: Show product categories (e.g., "Neural Networks", "Proxies") inside the shop, each leading to a list of specific products.
- Sub-products under Main Products: For example, selecting “ChatGPT” should open a list of sub-options: Продление подписки Plus, Готовый аккаунт Pro, Аккаунт без подписки Each sub-product has unique pricing and logic.
- Product Details & Purchase Flow: Each product page should include: Title, description, price, “Buy” button, If needed: form inputs (login, password, 2FA toggle)
- Interactive Purchase Form + Chat Redirection: After submitting login/password/2FA: Redirect the user to an embedded chat with a seller, or Return to Telegram to continue the dialogue via bot.
- Balance Check Before Purchase: Before confirming purchase: Verify user’s internal balance from backend. If insufficient: redirect to top-up screen.
- Balance Top-Up: Enable balance top-up via external Lava.io link or QR code.
- Admin Notifications via Telegram: After successful purchase, automatically send a Telegram message to an admin bot: Includes product name, user ID, and purchase amount.
- AI-Powered FAQ (Help Section): Integrate automated answers (e.g., via Gemini or OpenAI) for common user queries in Help section. This feature will use a tool to decide if the response to the user will include information about potentially available solutions.
- Backend API Connection: The entire system must interact with a custom backend (FastAPI) and a PostgreSQL database. Tables: users, products, orders, balances, proxy_orders. Interact via fetch() or Axios

## Style Guidelines:

- Чёткие блоки с тенью, стекло/металл, имперская симметрия
- Тёмный градиент (чёрный → тёмно-фиолетовый / синий), стекло
- Имперский фиолетовый #8A2BE2 или #6A0DAD
- Глубокий синий #1A1AFF или #2832C2
- Лёгкий неон голубой #00FFFF для свечения кнопок
- Exo, Orbitron, Roboto Mono, или Inter Bold
- Стеклянные, с лёгкой подсветкой при наведении
- Контурные, округлые, с неон-акцентами
- Плавные переходы, размытие, hover-эффекты со свечением