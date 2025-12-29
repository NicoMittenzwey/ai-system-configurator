# AI System Configurator

A React-based web application that helps users select the optimal hardware and software configuration for running AI models locally.

![AI System Configurator Screenshot](public/vite.svg) 
> *Note: Screenshot placeholder. Consider adding a real screenshot of the UI.*

## 🚀 Features

-   **Interactive Configurator**: Tailor recommendations based on user type (Individual vs. Organization) and specific use cases (Chat, Image Gen, Coding Support, etc.).
-   **Hardware Recommendations**: Get specific advice on GPU, VRAM, System RAM, and CPU requirements.
-   **Software & Model Suggestions**: Discover the best tools (Ollama, ComfyUI, vLLM) and models (Llama 3, Flux.1, Whisper) for your needs.
-   **Direct Links**: One-click access to official project repositories and Hugging Face model pages.
-   **Data Sovereignty Focus**: Learn why running local AI is better for privacy, GDPR compliance, and cost control.

## 🛠️ Tech Stack

-   **Frontend**: React
-   **Build Tool**: Vite
-   **Styling**: CSS (Premium Dark Theme)
-   **Deployment**: GitHub Pages

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/NicoMittenzwey/ai-system-configurator.git
    cd ai-system-configurator
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run locally**
    ```bash
    npm run dev
    ```
    Open your browser at `http://localhost:5173/ai-system-configurator/` (or the port shown in terminal).

## 🚀 Deployment

This project is configured for easy deployment to GitHub Pages.

1.  **Build**
    ```bash
    npm run build
    ```

2.  **Deploy**
    ```bash
    npm run deploy
    ```
    This command uses the `gh-pages` package to push the `dist` folder to the `gh-pages` branch.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
