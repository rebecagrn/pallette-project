# BrandZone - Color Palette Generator

A modern web application for generating and managing color palettes from images. Built with Next.js, TypeScript, and Tailwind CSS.

## Live Demo

Visit the live application at: [brandzone-project.vercel.app](https://brandzone-project.vercel.app)

## Project Demo

https://github.com/user-attachments/assets/cefee8e4-f8ac-485d-8c92-22b6ffecfa36

## Features

### Image Management

- Upload images via URL or file
- Organize images in custom groups
- Add tags to images
- Add and edit comments
- Delete images
- Favorite images for quick access

### Palette Management

- Generate color palettes from images
- Create custom color palettes
- Organize palettes in custom groups
- Add tags to palettes
- Add and edit comments
- Delete palettes
- Favorite palettes for quick access

### Organization

- Create and manage custom groups
- Create and manage tags
- Filter content by group or tag
- Search by name, comment, or tag
- Sort content by various criteria

### Statistics Dashboard

- View total counts of images and palettes
- Track favorite items
- Monitor tag usage statistics
- Analyze group distribution
- Track popular tags and groups

### Additional Features

- Export palettes in JSON format
- Import palettes from JSON files
- Color extraction from images
- Responsive design
- Dark mode support
- Offline support via localStorage

## Getting Started

### Prerequisites

- Node.js 18.x or later
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/pallette.git
cd pallette
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

## Project Structure

```
src/
├── app/                    # Next.js app router
├── components/            # React components
│   ├── common/           # Shared components
│   ├── images-module/    # Image-related components
│   ├── palettes-module/  # Palette-related components
│   ├── dashboard/        # Statistics dashboard components
│   └── layout/           # Layout components
├── lib/                   # Utility functions
├── store/                # Zustand store
├── types/                # TypeScript types
└── styles/               # Global styles
```

## Technical Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Color Processing**: ColorThief
- **Data Persistence**: LocalStorage

## Development

### Running Tests

```bash
pnpm test
```

### Code Style

```bash
pnpm lint
```

## Known Limitations

- Data is stored locally in the browser
- Limited image processing capabilities
- No backend integration yet
- No user authentication
- No collaborative features

## Future Improvements

### Planned Features

- Backend integration
- User authentication
- Collaborative features
- Advanced color editor
- AI-powered suggestions
- Advanced analytics
- Social sharing
- Mobile app version

### Performance Optimizations

- Server-side rendering
- Image optimization
- Caching strategies
- Progressive web app support

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [ColorThief](https://github.com/lokesh/color-thief)
