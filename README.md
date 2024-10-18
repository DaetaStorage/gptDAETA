# DÆTA-Extension

**Browser Extension for DÆTA Decentralized Application**

This project is a browser extension for DÆTA, built using React, TypeScript, and Vite.

## 📚 Table of Contents

- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development](#development)
- [Building](#building)
- [ESLint Configuration](#eslint-configuration)
- [Contributing](#contributing)
- [Contact](#contact)

## 🛠️ Technologies

- **TypeScript**: 93.4%
- **CSS**: 3.0%
- **JavaScript**: 2.6%
- **HTML**: 1.0%
- **React**: UI library
- **Vite**: Build tool and development server
- **ESLint**: Linting utility

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🗂️ Project Structure

- `public/`: Static files
- `src/`: Source code
- `.gitignore`: Git ignore file
- `README.md`: Project documentation
- `eslint.config.js`: ESLint configuration
- `index.html`: Entry HTML file
- `manifest.json`: Extension manifest file
- `package.json`: Project dependencies and scripts
- `postcss.config.js`: PostCSS configuration
- `tailwind.config.js`: Tailwind CSS configuration
- `tsconfig.json`: TypeScript configuration
- `vite.config.ts`: Vite configuration

## 💻 Development

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## 🏗️ Building

To build the extension for production:

```bash
npm run build
```

## 🧹 ESLint Configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

1. Configure the top-level `parserOptions` property like this:

```javascript
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

2. Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
3. Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
4. Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📬 Contact

For any questions or inquiries, feel free to reach out at:

- **Website**: [daeta.xyz](https://www.daeta.xyz/)
- **Twitter**: [@DaetaStorage](https://x.com/DaetaStorage)
- **Blog**: [daetastorage.medium.com](https://daetastorage.medium.com/)
- **Telegram**: [DaetaStorage](https://t.me/DaetaStorage)
- **Discord**: [discord.gg/DaetaStorage](https://discord.gg/DaetaStorage)
- **GitHub**: [github.com/DaetaStorage](https://github.com/DaetaStorage)
- **Documentation**: [docs.daeta.xyz](https://docs.daeta.xyz/)
- **Whitepaper**: [daeta.xyz/DaetaWPv1.0.pdf](https://daeta.xyz/DaetaWPv1.0.pdf)
- **Tokenomics**: [docs.daeta.xyz/tokenomics](https://docs.daeta.xyz/tokenomics)
- **Email**: [contact@daeta.xyz](mailto:contact@daeta.xyz)
