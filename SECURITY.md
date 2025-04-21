# Security Policy

## Supported Versions

Security updates and vulnerability fixes are applied only to the latest version of CyberTube Web available in the `main` branch. We recommend always using the most current version.

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |

## Reporting a Vulnerability

The CyberTube Web team takes security issues seriously. We appreciate your efforts to responsibly disclose any vulnerabilities you find and will make every effort to acknowledge your contribution.

**PLEASE DO NOT REPORT SECURITY VULNERABILITIES THROUGH PUBLIC GITHUB ISSUES.**

Instead, please report security vulnerabilities by sending an email directly to:

**`toxi360@workmail.com`**

Please include the following details in your report:

*   A clear description of the vulnerability.
*   Steps to reproduce the vulnerability (including specific URLs or configurations, if applicable).
*   The potential impact of the vulnerability.
*   The version of CyberTube Web you tested on (e.g., commit hash or release tag).
*   Any relevant logs or screenshots.

We will try to acknowledge receipt of your vulnerability report within 72 hours. We will work with you to understand and validate the issue and aim to address critical vulnerabilities promptly.

Please allow us a reasonable amount of time to fix the vulnerability before making any information public. We will coordinate the disclosure process with you.

## Security Philosophy and Scope

CyberTube Web is primarily designed for **personal use on a trusted local network**. Security considerations are based on this assumption.

**In Scope:**

*   Vulnerabilities in the Node.js/Express backend code (`server.js`).
*   Vulnerabilities in the frontend JavaScript code (`public/index.html`).
*   Issues related to improper handling of user input (e.g., URL parsing leading to unexpected server behavior).

**Out of Scope:**

*   **Vulnerabilities in `yt-dlp` itself:** Please report these directly to the [yt-dlp project](https://github.com/yt-dlp/yt-dlp).
*   **Vulnerabilities in `FFmpeg`:** Please report these to the [FFmpeg project](https://ffmpeg.org/security.html).
*   **Security of the underlying operating system or network environment.**
*   **Issues arising from exposing the server directly to the public internet without proper security measures (e.g., authentication, HTTPS, firewall rules).** This usage scenario is strongly discouraged.
*   **Denial of Service (DoS):** While we strive for stability, an application running on a personal machine is inherently vulnerable to DoS if misused or accessed externally.
*   **Social engineering attacks.**

## Disclosure Policy

Once a vulnerability is fixed, we will typically announce the fix in commit messages and/or release notes for the updated version. We may credit the reporter of the vulnerability if they consent.

---

Thank you for helping keep CyberTube DL Web secure!
