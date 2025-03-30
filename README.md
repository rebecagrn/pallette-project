# Palette Project

A modern web application for managing images and color palettes. Extract colors from images, create custom palettes, and organize your visual inspiration.

## Features

- 🖼️ Image Management

  - Upload images or add by URL
  - Extract color palettes from images
  - Organize with tags and groups
  - Add comments and favorites

- 🎨 Color Palettes

  - Create custom color palettes
  - Browse and organize palettes
  - Tag and group organization
  - Comment and favorite system

- 🔍 Search & Organization
  - Filter by tags and groups
  - Sort by date or name
  - Grid and list views
  - Quick search functionality

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- pnpm 8.0.0 or later

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/palette-project.git
cd palette-project
```

2. Install dependencies:

```bash
pnpm install
```

3. Run the development server:

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
palette-project/
├── src/
│   ├── app/                 # Next.js pages and layouts
│   ├── components/          # React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── store/              # Zustand store
│   └── types/              # TypeScript types
├── public/                 # Static assets
├── ARCHITECTURE.md         # System design documentation
├── package.json           # Project dependencies
└── README.md             # Project documentation
```

## Technical Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Testing**: Jest + React Testing Library

## Development

### Running Tests

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

### Code Style

The project uses ESLint and Prettier for code formatting. Run the linter:

```bash
pnpm lint
```

## Known Limitations

1. **Local Storage Only**: Currently uses browser localStorage for data persistence
2. **Image Handling**: Limited to URL-based images, no file upload storage
3. **Performance**: Large collections might impact performance due to client-side handling

## Future Improvements

1. **Server Integration**

   - Add backend API
   - Implement proper image storage
   - Add user authentication

2. **Feature Enhancements**

   - Color extraction API
   - Advanced palette generation
   - Social sharing features

3. **Performance Optimizations**
   - Image optimization
   - Infinite scrolling
   - Virtual list rendering

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
