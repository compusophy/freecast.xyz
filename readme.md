# freecast.xyz

Wildcard domains unlock the ability to build platforms that scale. With zero-configuration, you're able to provide your customers with a personalized space on your host domain. This project demonstrates the power of wildcard domains where users can create and manage their own streaming channels under custom subdomains.

## Technologies

- **Next.js**: React framework for building the web application
- **Vercel**: Deployment platform with built-in support for wildcard domains
- **Prisma**: Type-safe database ORM for managing user data and channels
- **PostgreSQL**: Robust database for storing user information and stream details
- **Pusher**: Real-time updates and chat functionality
- **NextAuth.js**: Authentication solution for secure user management

## Features

- Custom subdomain creation
- Automatic metadata generation for farcaster frames
- Responsive design for all devices



## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/compusophy/freecast.xyz.git
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Set up your environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Run the development server:
   ```bash
   yarn dev
   ```

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)