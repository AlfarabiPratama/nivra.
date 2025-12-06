# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in Nivra App, please report it by:

1. **Do NOT** open a public issue
2. Email the details to the repository maintainer
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and work on a fix as soon as possible.

## Security Best Practices

### For Users

1. **Data Storage**: All data is stored locally in your browser's localStorage
2. **No Cloud Sync**: Currently, no data is transmitted to external servers
3. **Browser Security**: Use updated browsers with security patches
4. **Export Regularly**: Use the export feature to backup your data

### For Developers

1. **Environment Variables**: Never commit `.env` files with real credentials
2. **Dependencies**: Regularly update dependencies to patch security vulnerabilities
3. **API Keys**: Use environment variables (VITE_ prefix) for any API keys
4. **Data Validation**: Always validate user input before processing
5. **XSS Protection**: React provides built-in XSS protection, but be careful with `dangerouslySetInnerHTML`

## Known Security Considerations

1. **localStorage**: Data is stored in plain text in localStorage
   - Not encrypted by default
   - Accessible to any script running on the same domain
   - Users should use trusted devices

2. **No Authentication**: Current version has no user authentication
   - Anyone with access to the device can access the app
   - Consider adding authentication in future versions

3. **CSV Export**: Exported files contain plain text data
   - Handle exported files securely
   - Don't share files containing sensitive information

## Dependency Security

Run regular security audits:

```bash
npm audit
npm audit fix
```

## License

This security policy is part of the Nivra App project and is subject to the same MIT License.
