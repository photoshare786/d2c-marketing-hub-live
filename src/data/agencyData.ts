export type PortfolioFilter =
  | 'all'
  | 'web-ecommerce'
  | 'seo-performance'
  | 'social-campaigns'
  | 'branding-creative'
  | 'courier-logistics';

export type PortfolioCategoryFilter = Exclude<PortfolioFilter, 'all'>;

export interface PortfolioProject {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  filterGroups: PortfolioCategoryFilter[];
  categories: string[];
  description: string;
  image: string;
  imageAlt: string;
  layoutVariant: 'wide' | 'offset-left' | 'offset-right';
  deliverables: string[];
  sampleScopeNote: string;
  overview: string;
  approach: string;
}

export interface ServiceItem {
  id: string;
  number: string;
  categoryLabel: string;
  title: string;
  description: string;
  capabilities: string[];
  relatedFilter: PortfolioFilter;
  relatedProjectId: string;
  image: string;
  imageAlt: string;
  visualType:
    | 'website-architecture'
    | 'seo-visibility'
    | 'social-editorial'
    | 'brand-specimen'
    | 'paid-media-matrix'
    | 'uiux-wireframe'
    | 'lead-funnel'
    | 'content-production'
    | 'motion-kinetic'
    | 'ecommerce-commerce'
    | 'mobile-experience'
    | 'cro-experiment';
  visualCaption: string;
  cardTopLabel: string;
  cardTopMeta: string;
  cardBottomBadge: string;
}

export interface ProcessStage {
  id: string;
  number: string;
  title: string;
  summary: string;
  items: string[];
  focusLabel: string;
}

export interface CaseStudyBlock {
  key: 'overview' | 'challenge' | 'solution' | 'execution' | 'results';
  label: string;
  title: string;
  body: string;
  highlights: string[];
}

export interface PartnershipApproachSlide {
  id: string;
  number: string;
  quote: string;
  category: string;
}

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'ecommerce-experience',
    number: '01',
    title: 'E-commerce Experience',
    subtitle: 'Conversion-Led Direct-to-Consumer Storefront Concept',
    filterGroups: ['web-ecommerce'],
    categories: ['Web & E-commerce', 'Storefront UX', 'Conversion Flow'],
    description:
      'An editorial direct-to-consumer shopping concept engineered for intuitive product discovery, responsive merchandising, and friction-free checkout.',
    image: '/src/assets/images/portfolio_ecommerce_ux_1795075820633.jpg',
    imageAlt:
      'Minimalist laptop and tablet displaying a dark-mode direct-to-consumer e-commerce product grid and checkout interface',
    layoutVariant: 'wide',
    deliverables: [
      'Custom Storefront UX Architecture',
      'Modular Product Grid & Filtering',
      'Slide-Out Cart & Express Checkout',
      'Responsive Performance Engineering',
    ],
    sampleScopeNote:
      'Original agency concept showcase — structured for custom D2C storefront engagements.',
    overview:
      'Conceived to bridge the gap between high-craft editorial storytelling and rapid product selection across desktop and tablet commerce journeys.',
    approach:
      'Pairs high-contrast product cards with persistent quick-add controls, clear sizing affordances, and lightweight frontend transitions.',
  },
  {
    id: 'seo-growth-strategy',
    number: '02',
    title: 'SEO Growth Strategy',
    subtitle: 'Technical Search & Organic Visibility Architecture',
    filterGroups: ['seo-performance'],
    categories: ['SEO & Performance', 'Technical Search', 'Content Mapping'],
    description:
      'A structured search architecture concept uniting clean crawl hierarchies, semantic schema systems, and intent-led editorial landing clusters.',
    image: '/src/assets/images/portfolio_seo_analytics_1795075821693.jpg',
    imageAlt:
      'Translucent glassmorphism SEO analytics panels showing organic search traffic trajectories and keyword ranking architecture',
    layoutVariant: 'offset-left',
    deliverables: [
      'Technical Crawl & Indexation Audit',
      'Search Intent & Topic Cluster Map',
      'Structured Schema Implementation',
      'Core Web Vitals & Speed Tuning',
    ],
    sampleScopeNote:
      'Original agency concept showcase — illustrative SEO framework for growth-stage brands.',
    overview:
      'Built around sustainable organic discovery, aligning site information architecture with how high-intent buyers research products and categories.',
    approach:
      'Combines clean URL taxonomy, programmatic internal linking, and editorial content templates designed for both search engines and readers.',
  },
  {
    id: 'social-media-campaign',
    number: '03',
    title: 'Social Media Campaign',
    subtitle: 'Serialized Short-Form Storytelling & Launch Engine',
    filterGroups: ['social-campaigns', 'branding-creative'],
    categories: ['Social Media & Campaigns', 'Short-Form Video', 'Creative Direction'],
    description:
      'A cohesive multi-format campaign system built for thumb-stopping vertical video hooks, carousel narratives, and synchronized launch moments.',
    image: '/src/assets/images/portfolio_social_campaign_1795075819657.jpg',
    imageAlt:
      'Floating smartphones in a dark studio presenting coordinated social media reels, campaign carousels, and content formats',
    layoutVariant: 'offset-right',
    deliverables: [
      'Campaign Creative Direction',
      'Short-Form Reels & Story Templates',
      'Editorial Carousel Narrative System',
      'Channel Rollout Calendar',
    ],
    sampleScopeNote:
      'Original agency concept showcase — modular creative blueprint for brand social channels.',
    overview:
      'Replaces fragmented one-off social posts with an unmistakable visual cadence engineered to hold viewer retention across feeds and stories.',
    approach:
      'Develops repeatable motion rules, kinetic typography hooks, and modular production kits tailored for rapid creative iteration.',
  },
  {
    id: 'brand-identity',
    number: '04',
    title: 'Brand Identity',
    subtitle: 'Comprehensive Visual System & Typographic Manual',
    filterGroups: ['branding-creative'],
    categories: ['Branding & Creative', 'Visual Identity', 'Design System'],
    description:
      'A disciplined identity framework spanning bespoke geometric wordmarks, strict typographic hierarchy, packaging accents, and digital brand standards.',
    image: '/src/assets/images/portfolio_brand_identity_1795075820308.jpg',
    imageAlt:
      'Dark matte brand guidelines book, embossed packaging box with lime accent interior, and typographic specimen sheets on slate',
    layoutVariant: 'wide',
    deliverables: [
      'Brand Positioning & Visual Territory',
      'Logo & Monogram Construction',
      'Typography & Grid Specification',
      'Digital & Packaging Brand Book',
    ],
    sampleScopeNote:
      'Original agency concept showcase — tailored for emerging and scaling consumer brands.',
    overview:
      'Designed to establish instant visual authority across storefronts, paid media assets, physical unboxing moments, and editorial communications.',
    approach:
      'Unites minimalist monochrome restraint with a sharp signature accent color and rigid grid rules that scale cleanly across every touchpoint.',
  },
  {
    id: 'digital-advertising',
    number: '05',
    title: 'Digital Advertising',
    subtitle: 'Full-Funnel Paid Search, Social & Conversion Architecture',
    filterGroups: ['seo-performance', 'social-campaigns'],
    categories: ['SEO & Performance', 'Paid Media', 'Conversion Funnels'],
    description:
      'An integrated acquisition blueprint connecting high-intent search ads, dynamic paid social creative, and conversion-focused landing experiences.',
    image: '/src/assets/images/portfolio_digital_advertising_1795075820689.jpg',
    imageAlt:
      'Floating digital advertising interfaces showing search ad cards, creative variants, and a translucent glass conversion funnel',
    layoutVariant: 'offset-left',
    deliverables: [
      'Search & Paid Social Ad Architecture',
      'Creative Testing Matrix',
      'Dedicated Acquisition Landing Pages',
      'Attribution & Funnel Event Setup',
    ],
    sampleScopeNote:
      'Original agency concept showcase — illustrating unified media buying and landing page strategy.',
    overview:
      'Eliminates visual disconnect between the first ad impression and the post-click landing journey so every channel works as one system.',
    approach:
      'Aligns ad messaging angles with tailored landing headlines, structured A/B creative variants, and clean conversion event instrumentation.',
  },
  {
    id: 'mobile-app-experience',
    number: '06',
    title: 'Mobile App Experience',
    subtitle: 'Tactile Native Commerce & Member Companion Concept',
    filterGroups: ['web-ecommerce', 'branding-creative'],
    categories: ['Web & E-commerce', 'Mobile UI/UX', 'Product Design'],
    description:
      'A thumb-friendly native mobile shopping and retention concept engineered for effortless browsing, instant cart actions, and curated drop alerts.',
    image: '/src/assets/images/portfolio_mobile_experience_1795075821132.jpg',
    imageAlt:
      'Two sleek dark smartphones angled on obsidian stone displaying mobile storefront discovery and cart screens',
    layoutVariant: 'offset-right',
    deliverables: [
      'iOS & Android Interface System',
      'Interactive Discovery & Cart Flows',
      'Component & Gesture Specification',
      'API & Checkout Architecture',
    ],
    sampleScopeNote:
      'Original agency concept showcase — built as a blueprint for native commerce companions.',
    overview:
      'Translates editorial desktop polish into a responsive pocket experience focused on speed, legibility, and frictionless repeat ordering.',
    approach:
      'Prioritizes dark-surface contrast, ergonomic bottom-reach CTAs, and streamlined checkout drawers tailored for on-the-go buyers.',
  },
  {
    id: 'courier-logistics-experience',
    number: '07',
    title: 'Courier & Logistics Digital Experience',
    subtitle: 'Global Freight, Express Tracking & Logistics Web Platform Concept',
    filterGroups: ['courier-logistics'],
    categories: ['Courier & Logistics', 'Global Shipping', 'Tracking UX'],
    description:
      'A complete digital experience for a modern international courier and logistics company, showcasing global shipping, domestic delivery, freight forwarding, shipment tracking and logistics solutions.',
    image: '/src/assets/images/portfolio_courier_logistics_dark_1795076690148.jpg',
    imageAlt:
      'Modern international courier website mockup with dark glassmorphism global shipment tracking dashboard, neon lime shipping route map, air freight, ocean cargo vessel, and black-and-lime branded delivery van on deep charcoal studio backdrop',
    layoutVariant: 'wide',
    deliverables: [
      'International Courier Web Platform',
      'Live Shipment Tracking Dashboard',
      'Air & Ocean Freight Route Showcase',
      'Fleet Branding & Logistics Analytics UI',
    ],
    sampleScopeNote:
      'Original agency concept showcase — tailored for international courier, freight forwarding, and logistics brands.',
    overview:
      'Designed as an end-to-end digital flagship for global logistics providers, unifying commercial freight quoting, domestic express booking, and real-time parcel visibility inside one authoritative interface.',
    approach:
      'Pairs crisp dark-graphite and white technical typography with glowing neon lime route visualizations, milestone tracking timelines, and cohesive fleet visual identity across web and mobile touchpoints.',
  },
];

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: 'website-design-development',
    number: '01',
    categoryLabel: 'Web & Digital Architecture',
    title: 'Website Design & Development',
    description:
      'We design and develop beautiful, high-performing websites that turn visitors into customers.',
    capabilities: [
      'UI/UX & Wireframe Design',
      'Responsive Website Development',
      'CMS & Custom Development',
      'Website Speed & Performance',
    ],
    relatedFilter: 'web-ecommerce',
    relatedProjectId: 'ecommerce-experience',
    image: '/src/assets/images/portfolio_ecommerce_ux_1795075820633.jpg',
    imageAlt: 'Editorial responsive website design displayed on laptop and tablet',
    visualType: 'website-architecture',
    visualCaption: 'Responsive Grid Systems · Sub-Second Frontend Craft',
    cardTopLabel: 'Editorial Web System',
    cardTopMeta: 'Desktop · Tablet · Mobile',
    cardBottomBadge: 'Custom Build',
  },
  {
    id: 'search-engine-optimization',
    number: '02',
    categoryLabel: 'Organic Search Growth',
    title: 'Search Engine Optimization',
    description:
      'We build search visibility through technical precision, content structure, and authoritative ranking signals that attract qualified organic demand.',
    capabilities: [
      'Technical SEO & Crawl Architecture',
      'On-Page Semantic Optimization',
      'High-Intent Keyword Strategy',
      'Schema & Structured Data',
      'Local & International Search',
    ],
    relatedFilter: 'seo-performance',
    relatedProjectId: 'seo-growth-strategy',
    image: '/src/assets/images/portfolio_seo_analytics_1795075821693.jpg',
    imageAlt: 'SEO growth architecture and organic visibility analytics interface',
    visualType: 'seo-visibility',
    visualCaption: 'Search Intent Mapping · Crawl & Schema Architecture',
    cardTopLabel: 'Search Architecture',
    cardTopMeta: 'Technical & Semantic',
    cardBottomBadge: 'Organic Growth',
  },
  {
    id: 'social-media-marketing',
    number: '03',
    categoryLabel: 'Audience & Channel Strategy',
    title: 'Social Media Marketing',
    description:
      'We craft editorial social media systems that deepen brand recognition, sustain viewer retention, and build loyal brand communities.',
    capabilities: [
      'Social Channel Positioning',
      'Editorial Content Calendars',
      'Short-Form Reels & Campaign Formats',
      'Community & Creator Management',
      'Engagement & Retention Analytics',
    ],
    relatedFilter: 'social-campaigns',
    relatedProjectId: 'social-media-campaign',
    image: '/src/assets/images/portfolio_social_campaign_1795075819657.jpg',
    imageAlt: 'Social media campaign storytelling across dark-mode smartphones',
    visualType: 'social-editorial',
    visualCaption: 'Editorial Content Calendars · Audience Retention',
    cardTopLabel: 'Social Storytelling Engine',
    cardTopMeta: 'Reels · Carousels · Stories',
    cardBottomBadge: 'Brand Reach',
  },
  {
    id: 'branding-identity',
    number: '04',
    categoryLabel: 'Identity & Visual Systems',
    title: 'Branding & Identity',
    description:
      'We shape distinctive brand identities with clear positioning, bespoke typography, and tactile visual standards built to endure across every touchpoint.',
    capabilities: [
      'Brand Strategy & Positioning',
      'Logotype & Monogram Systems',
      'Typography & Color Architecture',
      'Comprehensive Brand Guidelines',
      'Packaging & Digital Collateral',
    ],
    relatedFilter: 'branding-creative',
    relatedProjectId: 'brand-identity',
    image: '/src/assets/images/portfolio_brand_identity_1795075820308.jpg',
    imageAlt: 'Embossed dark brand manual, packaging box, and typographic specimen sheets',
    visualType: 'brand-specimen',
    visualCaption: 'Typographic Systems · Tactile Brand Manuals',
    cardTopLabel: 'Visual Identity Manual',
    cardTopMeta: 'Digital & Packaging',
    cardBottomBadge: 'Brand System',
  },
  {
    id: 'google-meta-advertising',
    number: '05',
    categoryLabel: 'Paid Acquisition & Media',
    title: 'Google & Meta Advertising',
    description:
      'We engineer structured search and paid social campaigns that pair thumb-stopping creative with disciplined conversion tracking and acquisition control.',
    capabilities: [
      'Google Search & Shopping Campaigns',
      'Meta Paid Social Creative Systems',
      'Audience Segmentation & Retargeting',
      'Creative Split Testing Matrix',
      'Server-Side Conversion Tracking',
    ],
    relatedFilter: 'seo-performance',
    relatedProjectId: 'digital-advertising',
    image: '/src/assets/images/portfolio_digital_advertising_1795075820689.jpg',
    imageAlt: 'Multi-channel digital advertising and funnel performance interface',
    visualType: 'paid-media-matrix',
    visualCaption: 'Full-Funnel Media Buying · Creative Testing',
    cardTopLabel: 'Paid Acquisition Matrix',
    cardTopMeta: 'Google Ads · Meta Ads',
    cardBottomBadge: 'Scaled Acquisition',
  },
  {
    id: 'ui-ux-design',
    number: '06',
    categoryLabel: 'Product & Interface Craft',
    title: 'UI/UX Design',
    description:
      'We design intuitive digital interfaces and modular component systems that eliminate friction and guide users effortlessly toward action.',
    capabilities: [
      'User Journey & UX Research',
      'Information Architecture & Wireframes',
      'High-Craft Interface Design Systems',
      'Interactive Clickable Prototypes',
      'Accessibility & Usability Testing',
    ],
    relatedFilter: 'web-ecommerce',
    relatedProjectId: 'mobile-app-experience',
    image: '/src/assets/images/about_agency_workspace_1795077023230.jpg',
    imageAlt: 'UI/UX wireframes, interface components, and analytics workstation',
    visualType: 'uiux-wireframe',
    visualCaption: 'Component Architecture · Interactive Prototyping',
    cardTopLabel: 'Interface Blueprint',
    cardTopMeta: 'Wireframes · Design System',
    cardBottomBadge: 'Product UX',
  },
  {
    id: 'lead-generation',
    number: '07',
    categoryLabel: 'Pipeline & Conversion Systems',
    title: 'Lead Generation',
    description:
      'We architect high-intent landing pages, multi-step capture flows, and campaign funnels designed to convert prospects into qualified revenue opportunities.',
    capabilities: [
      'High-Converting Campaign Landing Pages',
      'Multi-Stage Lead Funnels',
      'Frictionless Qualification Forms',
      'CRM & Pipeline Routing Integration',
      'Offer Positioning & Copywriting',
    ],
    relatedFilter: 'social-campaigns',
    relatedProjectId: 'digital-advertising',
    image: '/src/assets/images/hero_seo_marketing_3d_1795074702815.jpg',
    imageAlt: '3D digital marketing funnel and lead conversion dashboard ecosystem',
    visualType: 'lead-funnel',
    visualCaption: 'High-Intent Capture Flows · Qualified Pipeline Design',
    cardTopLabel: 'Lead Capture Architecture',
    cardTopMeta: 'Landing Pages · Funnels',
    cardBottomBadge: 'Pipeline Growth',
  },
  {
    id: 'content-creation',
    number: '08',
    categoryLabel: 'Editorial & Visual Production',
    title: 'Content Creation',
    description:
      'We produce cohesive photography, short-form video, and persuasive brand copy that articulate your product value across every customer channel.',
    capabilities: [
      'Art-Directed Campaign Stills',
      'Short-Form Video & Reels Production',
      'Brand & Conversion Copywriting',
      'Modular Social Creative Toolkits',
      'Editorial Storytelling Strategy',
    ],
    relatedFilter: 'social-campaigns',
    relatedProjectId: 'social-media-campaign',
    image: '/src/assets/images/portfolio_social_studio_1795031678978.jpg',
    imageAlt: 'Studio production set filming product content on dark cyclorama',
    visualType: 'content-production',
    visualCaption: 'Studio Direction · Editorial Copy & Video',
    cardTopLabel: 'Creative Studio Set',
    cardTopMeta: 'Video · Stills · Copy',
    cardBottomBadge: 'Content Engine',
  },
  {
    id: 'motion-design',
    number: '09',
    categoryLabel: 'Kinetic & 3D Storytelling',
    title: 'Motion Design',
    description:
      'We bring brands and product launches to life through refined 2D/3D animation, kinetic typography, and interactive web choreography.',
    capabilities: [
      'Brand & Product Motion Graphics',
      '3D Product Visualization Renders',
      'Kinetic Editorial Typography',
      'Launch Teasers & Explainer Films',
      'Interactive Web & UI Micro-Motion',
    ],
    relatedFilter: 'branding-creative',
    relatedProjectId: 'social-media-campaign',
    image: '/src/assets/images/hero_cinematic_studio_1795074324909.jpg',
    imageAlt: 'Cinematic motion production camera and dark lighting stage',
    visualType: 'motion-kinetic',
    visualCaption: 'Kinetic Typography · 2D & 3D Storytelling',
    cardTopLabel: 'Kinetic Motion Stage',
    cardTopMeta: '2D · 3D · UI Motion',
    cardBottomBadge: 'Visual Motion',
  },
  {
    id: 'ecommerce-solutions',
    number: '10',
    categoryLabel: 'Direct-to-Consumer Commerce',
    title: 'E-commerce Solutions',
    description:
      'We build refined direct-to-consumer storefronts structured around rapid product discovery, clear merchandising, and effortless checkout completion.',
    capabilities: [
      'Custom D2C Storefront Architecture',
      'Product Catalogue & Variant UX',
      'Slide-Out Cart & Express Checkout',
      'Payment & Shipping Integrations',
      'Average Order Value Optimization',
    ],
    relatedFilter: 'web-ecommerce',
    relatedProjectId: 'ecommerce-experience',
    image: '/src/assets/images/portfolio_ecommerce_luxury_1795031676424.jpg',
    imageAlt: 'Direct-to-consumer luxury product merchandising presentation',
    visualType: 'ecommerce-commerce',
    visualCaption: 'Catalogue Craft · Frictionless Checkout Systems',
    cardTopLabel: 'D2C Storefront System',
    cardTopMeta: 'Catalogue · Checkout',
    cardBottomBadge: 'Commerce Ready',
  },
  {
    id: 'mobile-app-development',
    number: '11',
    categoryLabel: 'iOS & Android Engineering',
    title: 'Mobile App Development',
    description:
      'We engineer fast, tactile mobile applications that deliver seamless pocket shopping, member loyalty, and connected tracking experiences.',
    capabilities: [
      'Native iOS & Android Engineering',
      'Ergonomic Mobile Interface Systems',
      'Real-Time API & Tracking Integration',
      'Push & In-App Retention Flows',
      'Performance & Release Maintenance',
    ],
    relatedFilter: 'web-ecommerce',
    relatedProjectId: 'mobile-app-experience',
    image: '/src/assets/images/portfolio_mobile_experience_1795075821132.jpg',
    imageAlt: 'Dual dark-mode mobile commerce application screens on obsidian stone',
    visualType: 'mobile-experience',
    visualCaption: 'Cross-Platform Native · API-Driven Reliability',
    cardTopLabel: 'Native Mobile Companion',
    cardTopMeta: 'iOS · Android · API',
    cardBottomBadge: 'Mobile Product',
  },
  {
    id: 'conversion-rate-optimization',
    number: '12',
    categoryLabel: 'Experimentation & Telemetry',
    title: 'Conversion Rate Optimization',
    description:
      'We audit customer journeys, test high-impact hypotheses, and refine checkout and landing flows to turn existing traffic into compounding revenue.',
    capabilities: [
      'Full-Funnel Conversion Audits',
      'Landing Page & Checkout Refinement',
      'Behavioral Heatmap & Funnel Analysis',
      'Structured A/B Split Experiments',
      'Core Web Vitals Speed Engineering',
    ],
    relatedFilter: 'web-ecommerce',
    relatedProjectId: 'ecommerce-experience',
    image: '/src/assets/images/service_cro_lab_1795079568721.jpg',
    imageAlt:
      'Dark glassmorphism Conversion Rate Optimization experimentation dashboard displaying A/B testing variants, neon lime website conversion funnel stages, click heatmap visualization, and conversion lift metrics',
    visualType: 'cro-experiment',
    visualCaption: 'Active Focus: Conversion Funnel Optimization',
    cardTopLabel: 'Experimentation Lab',
    cardTopMeta: 'A/B Testing · Funnel CRO',
    cardBottomBadge: 'Conversion Lift',
  },
];

export const PROCESS_STAGES: ProcessStage[] = [
  {
    id: 'research',
    number: '01',
    title: 'Research',
    summary:
      'Every durable digital product or campaign starts by understanding the market landscape, category signals, and customer decision triggers.',
    items: [
      'Market Research',
      'Competitor Analysis',
      'Audience Understanding',
      'Business Goals',
    ],
    focusLabel: 'Discovery & Intelligence',
  },
  {
    id: 'strategy',
    number: '02',
    title: 'Strategy',
    summary:
      'We translate research into a clear commercial roadmap—aligning brand positioning, channel selection, content architecture, and measurable targets.',
    items: [
      'Digital Strategy',
      'Campaign Planning',
      'Content Strategy',
      'KPI Definition',
    ],
    focusLabel: 'Strategic Blueprint',
  },
  {
    id: 'design',
    number: '03',
    title: 'Design',
    summary:
      'Strategic clarity becomes distinctive visual direction—crafting cohesive identities, editorial art direction, and intuitive interfaces.',
    items: [
      'Visual Direction',
      'Branding',
      'UI/UX Design',
      'Creative Development',
    ],
    focusLabel: 'Design & Art Direction',
  },
  {
    id: 'development',
    number: '04',
    title: 'Development',
    summary:
      'Design systems and campaign concepts move into production with clean frontend engineering, multi-channel deployment, and tight QA.',
    items: [
      'Website Development',
      'Marketing Campaigns',
      'Content Production',
      'Implementation',
    ],
    focusLabel: 'Engineering & Launch',
  },
  {
    id: 'optimization',
    number: '05',
    title: 'Optimization',
    summary:
      'Launch is the starting line. We monitor behavior, refine conversion bottlenecks, and iterate creative and media performance continuously.',
    items: [
      'Performance Analysis',
      'Conversion Optimization',
      'Reporting',
      'Continuous Improvement',
    ],
    focusLabel: 'Iterative Growth',
  },
];

export const CASE_STUDY_BLOCKS: CaseStudyBlock[] = [
  {
    key: 'overview',
    label: '01 · Project Overview',
    title: 'Digital-First Brand Architecture & Full-Funnel Growth',
    body: 'Designed to transform brand perception into sustained commercial velocity—uniting strategic positioning, conversion-led web architecture, paid media creative, and funnel optimization to turn qualified demand into measurable revenue growth.',
    highlights: [
      'Client / Brand Name: Illustrative D2C Brand',
      'Services Delivered: Brand Strategy · Creative Direction · Digital Advertising · CRO',
      'Timeline: 10 Weeks (Discovery to Full Commercial Rollout)',
    ],
  },
  {
    key: 'challenge',
    label: '02 · Challenge',
    title: 'Closing the Gap Between Brand Equity & Performance',
    body: 'Disconnected creative campaigns and generic landing experiences often dilute brand authority while driving up customer acquisition costs across paid search and social channels.',
    highlights: [
      'Inconsistent messaging between paid social creative and flagship landing pages',
      'High consideration drop-off across key product discovery and inquiry flows',
      'Lack of unified attribution linking creative testing to downstream revenue',
    ],
  },
  {
    key: 'solution',
    label: '03 · Creative Solution',
    title: 'Unified Brand Storytelling Built for Conversion',
    body: 'We aligned visual direction, high-intent landing page architecture, and modular campaign creative into a single cohesive digital ecosystem engineered for clarity and action.',
    highlights: [
      'Distinctive dark-editorial visual language tailored across web and paid media',
      'Conversion-focused page hierarchy reducing friction from first click to checkout',
      'Message-matched ad creative and landing headlines to lift buyer intent',
    ],
  },
  {
    key: 'execution',
    label: '04 · Execution',
    title: 'Integrated Design, Engineering & Multi-Channel Rollout',
    body: 'Our interdisciplinary team executed responsive website development, multi-format Google & Meta campaign assets, server-side conversion tracking, and structured A/B experimentation sprints concurrently.',
    highlights: [
      'Responsive high-speed website development engineered for Core Web Vitals',
      'Multi-format Google & Meta campaign assets built for iterative A/B experimentation',
      'Full-funnel conversion tracking across micro-conversions, leads, and purchase events',
    ],
  },
  {
    key: 'results',
    label: '05 · Results',
    title: 'Performance Metrics & Business Impact',
    body: 'Track measurable business performance across traffic acquisition, conversion efficiency, lead generation, and revenue growth. Every metric reflects the impact of an integrated digital growth strategy.',
    highlights: [
      'Website Traffic | Organic & Paid Sessions',
      'Conversion Rate | Website / Funnel Conversion Rate',
      'Leads Generated | Qualified Leads',
      'Revenue Growth | Attributed Commercial Revenue',
    ],
  },
];

export const PARTNERSHIP_APPROACH_SLIDES: PartnershipApproachSlide[] = [
  {
    id: 'approach-brand-strategy',
    number: '01',
    quote:
      '“Great brands are built when strategy, creativity, and commercial goals move in the same direction.”',
    category: 'BRAND POSITIONING · CREATIVE STRATEGY',
  },
  {
    id: 'approach-web-experience',
    number: '02',
    quote:
      '“Every digital interaction should create a better experience, build trust, and move customers closer to action.”',
    category: 'WEB EXPERIENCE · DIGITAL ARCHITECTURE',
  },
  {
    id: 'approach-performance-cro',
    number: '03',
    quote:
      '“Sustainable growth comes from continuous testing, smarter decisions, and measurable performance.”',
    category: 'PERFORMANCE MARKETING · CONVERSION OPTIMIZATION',
  },
];
