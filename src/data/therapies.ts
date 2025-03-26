interface TherapyContent {
  title: string;
  subtitle?: string;
  description: string;
  benefits?: string[];
  expertInfo?: string;
  additionalContent?: {
    title: string;
    content: string;
  }[];
}

export const therapyContent: Record<string, TherapyContent> = {
  "neuropuncture": {
    title: "Neuropuncture",
    subtitle: "The fusion of modern neuroscience and acupuncture for targeted healing",
    description: "Neuropuncture or Neuroscience Acupuncture is a modern acupuncture system that integrates neuroscience, electrical stimulation, and evidence-based medicine to optimise treatment outcomes. By targeting specific neural pathways, Neuropuncture enhances the body's natural ability to heal, restore function, and manage pain.",
    benefits: [
      "Chronic pain relief",
      "Neurological disorder support",
      "Muscle rehabilitation and motor function recovery",
      "Stress and anxiety management",
      "Cognitive function enhancement",
      "Optimised nerve regeneration"
    ],
    expertInfo: "Dr. VJ is the only Certified Neuropuncturist in the UK, having completed postgraduate training in Neuroscience Acupuncture (Neuropuncture Foundation, FL, USA) and a Doctorate in Neuroscience. His advanced expertise combines traditional healing wisdom with cutting-edge neuroscience for optimal treatment outcomes."
  },
  "acupuncture": {
    title: "Acupuncture",
    subtitle: "Traditional Chinese medicine for modern wellness",
    description: "Acupuncture involves the insertion of very thin needles through your skin at strategic points on your body. A key component of traditional Chinese medicine, acupuncture is most commonly used to treat pain and promote overall wellness.",
    benefits: [
      "Headache and migraine relief",
      "Nausea and vomiting management",
      "Menstrual cramp relief",
      "Fertility support",
      "Muscle pain treatment",
      "Respiratory disorder relief",
      "Arthritis treatment"
    ]
  },
  "german-auricular-medicine": {
    title: "German Auricular Medicine",
    subtitle: "Advanced ear acupuncture for precise diagnosis and treatment",
    description: "German Auricular Medicine (GAM), developed by Dr. Paul Nogier and further refined by Dr. Frank Bahr and Dr. Beate Strittmatter, is a sophisticated system of diagnosis and treatment that utilises the ear as a map of the body. Unlike traditional acupuncture, GAM focuses on the central nervous system rather than meridians, making it a precise and targeted approach to healing.",
    benefits: [
      "Precise pain management",
      "Stress and emotional regulation",
      "Allergy and immune system support",
      "Neurological disorder treatment",
      "Organ function optimisation",
      "Detoxification and metabolic enhancement"
    ],
    additionalContent: [
      {
        title: "About GAM",
        content: "GAM is based on Dr. Nogier's discovery that the outer ear (auricle) is a reflex zone representing the entire body. This concept was expanded upon by German researchers, who developed advanced diagnostic and treatment methods."
      },
      {
        title: "Treatment Approach",
        content: "Rather than working with meridians, GAM emphasises the role of the central nervous system in health and disease, allowing for highly specific treatments that address neurological imbalances. Active auricular points are treated using fine needles, laser, or electrical stimulation to reset the brain's faulty communication signals, thereby restoring the body's natural balance and promoting healing."
      },
      {
        title: "Recognition",
        content: "GAM is widely practised in Germany, where many doctors, pain specialists, and integrative medicine practitioners incorporate it into their treatment protocols. It is recognised as an effective and science-backed method for addressing pain, neurological disorders, and systemic imbalances."
      }
    ]
  },
  "massage": {
    title: "Massage",
    subtitle: "Ancient healing tradition for modern wellness",
    description: "Massage is one of the oldest therapeutic practices, used for centuries by ancient cultures such as the Greeks, Egyptians, Chinese, and Indians. Massage therapy supports relaxation, pain relief, and overall well-being through the manipulation of soft tissues.",
    benefits: [
      "Subacute/chronic low back pain relief",
      "Delayed onset muscle soreness recovery",
      "Anxiety and stress reduction",
      "Soft tissue injury rehabilitation",
      "High blood pressure management",
      "Insomnia relief"
    ],
    additionalContent: [
      {
        title: "Sports Massage",
        content: "Sports massage is specifically designed for athletes and active individuals to enhance performance, prevent injuries, and accelerate recovery. It combines deep tissue techniques and stretching to relieve muscle tension and improve flexibility. Benefits include increased blood circulation and oxygen supply to muscles, reduced muscle soreness and stiffness, prevention of sports-related injuries, improved flexibility and range of motion, and faster recovery after exercise or injury."
      },
      {
        title: "Indian Head Massage",
        content: "Indian Head Massage is a traditional therapy rooted in Ayurvedic medicine that focuses on the head, neck, and shoulders. It promotes relaxation, relieves tension, and improves mental clarity by stimulating pressure points in these areas. Benefits include stress and anxiety reduction, relief from headaches and migraines, improved sleep quality, enhanced scalp and hair health, and increased blood circulation to the brain."
      },
      {
        title: "Lymphatic Drainage",
        content: "Lymphatic drainage massage is a specialised technique that helps stimulate the lymphatic system, encouraging the removal of toxins, reducing swelling, and enhancing overall immune function. This gentle and rhythmic massage supports the body's natural detoxification process. Benefits include reduction of fluid retention and swelling, enhanced immune system function, detoxification and improved circulation, relief from lymphoedema and post-surgical swelling, and stress reduction and relaxation."
      }
    ]
  },
  "chinese-fire-cupping": {
    title: "Chinese Fire Cupping Therapy",
    subtitle: "Ancient therapy for modern healing",
    description: "Cupping is an ancient form of complementary therapy in which a therapist puts special cups on your skin to create suction. This therapy helps with pain, inflammation, blood flow, relaxation and well-being.",
    benefits: [
      "Reduced muscle tension",
      "Improved circulation",
      "Lymphatic system stimulation",
      "Stress hormone reduction",
      "Blood disorders treatment",
      "Skin problems relief"
    ]
  },
  "reflexology": {
    title: "Reflexology",
    subtitle: "Holistic healing through pressure points",
    description: "Reflexology is a treatment based on the principle that there are areas and points on the feet connected through the nervous system to corresponding parts of the body. When pressure is applied to these areas, it stimulates the movement of energy along the nerve channels.",
    benefits: [
      "Deep relaxation",
      "Improved nerve function",
      "Enhanced cognitive reactions",
      "Better blood circulation",
      "Headache and migraine relief"
    ]
  },
  "womens-health": {
    title: "Women's Health",
    subtitle: "Specialised care throughout all life stages",
    description: "At Maitri, we specialise in women's health, offering holistic support from puberty to post-menopause. Our treatments work alongside modern medicine to provide personalised care tailored to your unique needs. Based on a comprehensive consultation, we create bespoke treatment plans using therapies such as Acupuncture, Neuropuncture, Chinese Herbal Remedies, German Auricular Medicine, or Massage.",
    benefits: [
      "Puberty and hormone balancing",
      "Painful periods including PCOS",
      "Fertility support",
      "Menopause symptoms"
    ]
  },
  "frequency-healing": {
    title: "Frequency Healing",
    subtitle: "Harnessing energy for optimal well-being",
    description: "Frequency Healing is a cutting-edge therapy that utilises scalar waves and specific frequencies to promote balanced energy fields and enhance overall health. By working at a vibrational level, this method supports the body's natural healing mechanisms and restores harmony.",
    benefits: [
      "Enhanced energy and vitality",
      "Emotional and stress relief",
      "Improved sleep quality",
      "Detoxification and immune support"
    ],
    additionalContent: [
      {
        title: "Our Programmes",
        content: "Explore our curated selection of frequency healing programmes, available both in-clinic and remotely. Click book now for a Frequency Healing consultation."
      }
    ]
  }
};