const content = [
  {
    type: 'hero',
    key: 'hero',
    data: {
      title: 'The New Standard.',
      subtitle: 'Spring / Summer 2026',
      ctaText: 'Explore Collection',
      ctaLink: '/products',
      secondaryCtaText: 'Our Heritage',
      secondaryCtaLink: '/heritage',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070',
    },
  },
  {
    type: 'navbar',
    key: 'navbar',
    data: [
      { label: 'Collection', href: '/products', order: 1 },
      { label: 'Heritage', href: '/about', order: 2 },
    ],
  },
  {
    type: 'footer',
    key: 'footer',
    data: [
      {
        heading: 'Collections',
        links: [
          { label: 'New Arrivals', href: '/products?category=New Arrivals' },
          { label: "Men's Collection", href: '/products?category=Mens' },
          { label: "Women's Collection", href: '/products?category=Womens' },
          { label: 'The Essentials', href: '/products?category=Essentials' },
        ],
      },
      {
        heading: 'Experience',
        links: [
          { label: 'Our Heritage', href: '/about' },
          { label: 'Sustainability', href: '/sustainability' },
          { label: 'Contact Us', href: '/contact' },
          { label: 'Shipping & Returns', href: '/shipping' },
        ],
      },
    ],
  },
  {
    type: 'page',
    key: 'about',
    slug: 'about',
    title: 'Our Heritage',
    body: '<h1>Our Heritage</h1><p>Lotus & Lion was founded on the principles of timeless craftsmanship and uncompromising quality. Our journey began with a simple vision: to create luxury essentials that empower the modern pioneer.</p>',
    isPublished: true,
  },
];

module.exports = content;
