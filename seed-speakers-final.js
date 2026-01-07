import { collection, deleteDoc, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from './src/services/firebase/config.js';

const speakers = [
  {
    "id": "anchita-kaul",
    "name": "Anchita Kaul",
    "bio": "Anchita Kaul is a learning experience designer and researcher from India, exploring how play and culture can shape meaningful learning. With a background in toy and game design, she creates experiences that connect children to their context, culture, and curiosity. Having always learned through diverse forms - be it theatre, music, or sport, she recognizes the power of engaging multiple media to understand the world. Her ongoing inquiry revolves around rethinking how and what we learn, and how creative, embodied, and contextual experiences can transform education into a more personal and exploratory journey.",
    "linkedin": null,
    "image": null
  },
  {
    "id": "anup-talwar",
    "name": "Anup Talwar",
    "bio": "Anup Talwar brings 26 years of experience working with diverse cultures and nationalities, curating meaningful learning journeys through laughter, play, and intentionally designed experiences that foster insight. As an international NLP trainer, he guides participants from foundational programs to trainer certifications and leads the Train-the-Facilitative-Trainer program, blending Experiential Learning with NLP. His work spans corporate leaders, educators, and facilitators, creating spaces where participants fully engage, reflect deeply, and make meaning of their experiences. Through thoughtfully crafted experiences, Anup empowers people to discover awareness, insight, and growth. Expeditions of body, mind, and spirit are central to his joyful, transformative methodology.",
    "linkedin": "https://www.linkedin.com/in/anup-talwar/",
    "image": null
  },
  {
    "id": "ashima-sheth",
    "name": "Ashima Sheth",
    "bio": "Ashima Sheth is an educator and mostly worked with Montessori principles, experiential learning facilitator, and educational consultant based in Mumbai. With over a decade of experience in alternative classroom, she works at the intersection of Montessori principles, experiential education, and ecological learning. She is also the founder of Oubaitori Experiential Programs, where she designs nature and outdoor based sessions for the children with her unique flavour based in her experiences.",
    "linkedin": null,
    "image": null
  },
  {
    "id": "chetan-vohra",
    "name": "Chetan Vohra",
    "bio": "Chetan Vohra is an accomplished author of the Sochu series. With a background in cinematography, directing, writing, and producing, Chetan's passion lies in crafting wholesome and mindful entertainment for children. He believes entertainment is the new education and strives to spark imaginations while instilling values like empathy, creativity and other 21st-century skills. Chetan's commitment to experiential education and psychology has shaped his approach, which is evident in the thoughtful ways he crafts his stories. His dedication has led to the Sochu series becoming a best-selling children's book series in India, and he plans to expand Sochu into education and television.",
    "linkedin": null,
    "image": null
  },
  {
    "id": "divya-arathi-madiazhagan",
    "name": "Divya Arathi Madiazhagan",
    "bio": "Divya Arathi is a facilitator, coach, and lifelong learner deeply curious about how humans learn and evolve. As the founder of Coach Codega, she designs reflective, experiential spaces that bridge intellect and intuition, helping individuals understand not just what to learn, but how learning happens. Her work integrates insights from neuroscience, philosophy, and education theory with the Socratic and experiential learning traditions. Guided by empathy and inquiry, Divya continuously explores how children and adults construct meaning and transform through awareness. At her core, she remains a learner—committed to understanding the art and science of learning itself.",
    "linkedin": null,
    "image": null
  },
  {
    "id": "diyanat-ali",
    "name": "Diyanat Ali",
    "bio": "Diyanat Ali is a facilitator, coach, experiential educator, and founder of Outlife, an organization focusing on experiential learning, outdoor education, outbound training. For over two decades, he has designed and led transformational learning experiences that integrate the science of the nervous system with the art of facilitation. Drawing from Polyvagal Theory, Somatic Psychology, and Presence-Based Coaching, Diyanat creates spaces of safety, reflection, and authentic connection. His work bridges embodiment and education, helping facilitators, teams, and communities cultivate resilience, awareness, and transformation through lived experience.",
    "linkedin": null,
    "image": null
  },
  {
    "id": "hemali-gandhi",
    "name": "Hemali Gandhi",
    "bio": "Hemali Gandhi, facilitator and founder of EandMe, brings over 25 years of experience in education, with international expertise spanning India and London. She launched a pre-primary school rooted in Montessori principles and served as its principal for 17 years, during which she educated over 2,000 students. She also earned a Diploma in Experiential Education and Practices and is known for blending warmth, humor, and depth, encouraging people to move from knowledge to awareness and from awareness to meaningful action. She uses experiential methodologies to build soft skills and social-emotional learning skills within communities.",
    "linkedin": null,
    "image": null
  },
  {
    "id": "jasmin-jasin",
    "name": "Jasmin Jasin",
    "bio": "Jasmin Jasin is co-founder and principal of Gemala Ananda elementary school. She holds a Master's degree in teaching and learning, and brought facilitation to the classroom, based on her belief that learning is effective when learners construct their own understanding rather than being lectured.",
    "linkedin": null,
    "image": null
  },
  {
    "id": "kavitha-talreja",
    "name": "Kavitha Talreja",
    "bio": "Kavitha, Founder of Learning Ethos, is a seasoned L&D leader with 24+ years of strategic experience at industry giants like Fidelity and Citibank. She specializes in challenging conventional training by transforming complex business needs into impactful, gamified blended learning programs. Leveraging expertise in Design Thinking and advanced facilitation like Lego Serious Play, Kavitha focuses on the 'power of play' to create immersive experiences. Her mission is to drive measurable, lasting behavioral change, ensuring learning results in enhanced performance and significant business impact.",
    "linkedin": null,
    "image": null
  },
  {
    "id": "mukta-joshi",
    "name": "Mukta Joshi",
    "bio": "M. A. Psychology, Diploma in Narrative Practices, Certificate in Solution Focused Brief Therapy, Certificate in Nature Based Therapeutic Practices, Certificate in Basic and Advanced Mountaineering, Certificate in Intermediate White-Water Kayaking, Diploma in Experiential Education and Practice, Training in Outdoor Therapy.",
    "linkedin": "https://www.linkedin.com/in/mukta-joshi-825a79174?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    "image": null
  },
  {
    "id": "natasha-nayar",
    "name": "Natasha Nayar",
    "bio": "Natasha Nayar is a Social and Emotional Learning (SEL) expert, educator, and coach from Bangalore. She combines Psychology, Education, and Nature-based practices to build resilience, well-being, and purpose in young people. After over a decade of teaching high school Psychology, she founded SHAKTI Warriors India, a pioneering program that empowers children through Nature, Play, and Purpose. A lifelong trekker shaped by her early journeys in the Himalayas, Natasha brings the spirit of the outdoors into her work. Now based in Goa, she is on a mission to spark a global movement for children's well-being, beginning in India.",
    "linkedin": null,
    "image": null
  },
  {
    "id": "niken-rarasati",
    "name": "Niken Rarasati",
    "bio": "Niken Rarasati is an education policy researcher turned socio-preneur, driven by her passion to address systemic challenges in Indonesia's education landscape. Beginning her facilitation journey in 2013, she has since collaborated with communities, educators, and policymakers to co-create learning systems that nurture human potential. As Co-Founder and Chief Learning Officer of Talenesia, she builds a learning ecosystem connecting professionals, small business owners, and underserved talents. Her daily work with learners who enter with a sense of learned helplessness has inspired her ongoing quest to understand how agency can be cultivated as the foundation for transformative learning.",
    "linkedin": null,
    "image": null
  },
  {
    "id": "pratyay-malakar",
    "name": "Pratyay Malakar",
    "bio": "Pratyay Malakar is a Ph.D. scholar in the School of Education Studies at Ambedkar University Delhi and a UGC-NET JRF awardee. With prior experience in the social impact and teacher education sector, Pratyay's work spans across inclusive pedagogy, critical theory, and feminist approaches to education. Coming from a family of teachers, she carries both lived experience and professional commitment to reimagining classrooms as spaces of equity and justice. Her ongoing research focuses on undergraduate teacher education programs in India, pedagogy of social justice, and how power, and social identity shape learning in Indian and South Asian contexts.",
    "linkedin": "https://www.linkedin.com/in/pratyay-malakar-baa821129/",
    "image": null
  },
  {
    "id": "racy-shukla",
    "name": "Racy Shukla",
    "bio": "Racy Shukla is an experiential educator, counselor, and trainer passionate about designing learning experiences that nurture emotional intelligence and reflective thinking. As Head of Facilitator Training at Entendido, she empowers educators to connect deeply with learners through the power of process and reflection. With years of experience across classrooms, outdoor spaces, and professional trainings, Racy's work bridges psychology and pedagogy to create authentic, human-centered learning environments. Her facilitation style blends warmth, curiosity, and insight—inviting participants to not just learn, but truly experience growth.",
    "linkedin": "https://www.linkedin.com/in/racy-shukla-5aa525143/",
    "image": null
  },
  {
    "id": "rashmi-datt",
    "name": "Rashmi Datt",
    "bio": "Rashmi Datt designs and facilitates interactive learning environments, using action of psychodrama, sociodrama and sociometry (based on JL Moreno's work). She is a certified Psychodrama Practitioner and Trainer (PAT) from the Moreno Institute, Germany; and CEO of Vedadrama which provides certification in Psychodrama to coaches and facilitators. She coaches CXOs and facilitates teams, enabling them to work with greater synergy- leading to higher productivity as well as employee morale. She has authored two books in Emotional Intelligence: 'Managing Your Boss', which was translated into - Mandarin and bahasa Indonesia; and 'And the Lion Smiled at the Rabbit- Manage Emotions to Win'.",
    "linkedin": null,
    "image": null
  },
  {
    "id": "riju-banerjee",
    "name": "Riju Banerjee",
    "bio": "Riju is a trans* feminist practitioner, a gender justice activist and an education practitioner practicing inclusive and intersection pedagogy. Her body of work includes creating safer learning spaces for marginalized young people so that they are able to access knowledge and skills in a system of care. She closely works with young people and adolescents in schools and community settings between the age 8 to 25 across various contexts of India.",
    "linkedin": "https://www.linkedin.com/in/riju-banerjee-she-they-57b851140/",
    "image": null
  },
  {
    "id": "rinti-sengupta",
    "name": "Rinti Sengupta",
    "bio": "Rinti Sengupta, is the founder of Handsnstories since 2021 that aspires to bring innovative education to make learning fun and engaging. She is a professional Puppeteer with UNIMA number #2645 and a certified Storyteller from Small Tales Academy. She is a teacher trainer and resource person for colleges, academic centers, museums schools. She has co-authored two Academic books for teachers and presented a Paper on Promoting Sustainable Puppetry in Indian Education through NEP-2020 in the National Conference this year. She believes in the transformative power of storytelling, puppetry, and visual thinking to develop skills among learners and educators alike.",
    "linkedin": "https://www.linkedin.com/in/rinti-sengupta-969032179/",
    "image": null
  },
  {
    "id": "ritu-dua",
    "name": "Ritu Dua",
    "bio": "Ritu Dua is an art therapist, artist, author and a Shinrin-yoku (Forest Bathing) guide, based in Pune, India. Her work spans clinical, educational, corporate and community settings, with a focus on nature-based practices, mindfulness and contemplative practices. She works with people across all age groups -helping them explore, process, and express emotions through art and creativity. Her article 'Indigenous Gond Art in Art Therapy: A Nature-Based Creative Process' was recently published in Art Therapy: Journal of the American Art Therapy Association. When not facilitating or writing, she reads, makes art, engages in slow-stitching, gardening and hugging trees!",
    "linkedin": null,
    "image": null
  },
  {
    "id": "simran-sanganeria",
    "name": "Simran Sanganeria",
    "bio": "Simran Sanganeria is a sexuality exploration facilitator with over five years of experience creating safe, playful, and reflective spaces for individuals to explore their sexualities as unique and evolving parts of their lives. Her work spans grassroots SRHR projects with tribal women in Panna, Madhya Pradesh, and young girls from urban slums in Delhi. Drawing from Theatre of the Oppressed, Play for Peace, and Somatic Movement Practices, she weaves body awareness, storytelling, and creative dialogue to make sexuality simple, spoken, and part of everyday understanding.",
    "linkedin": "https://in.linkedin.com/in/simran-sanganeria-80bb66a5",
    "image": null
  },
  {
    "id": "sinthuja-shanmuganathan",
    "name": "Sinthuja Shanmuganathan",
    "bio": "Sinthuja Shanmuganathan is a peace psychology practitioner and global community engagement professional dedicated to promoting inclusive, play-based peacebuilding. As Community Engagement Coordinator at Play for Peace, she leads experiential education and partnership initiatives across conflict-affected regions, empowering youth and facilitators to create compassionate communities. With a Master's in Peace and Conflict Studies and a background in psychology, she brings expertise in facilitation, project design, and intercultural collaboration. Sinthuja's work bridges theory and practice—transforming play, empathy, and dialogue into tools for social healing and justice.",
    "linkedin": null,
    "image": null
  },
  {
    "id": "somsuvra-chatterjee",
    "name": "Somsuvra Chatterjee",
    "bio": "Somsuvra Chatterjee is an engineer turned educator. Presently he works in Nagpur helping the local government set up schools in a public private partnership model. He works with a team of 160, reaching out to more than 1800 students. Somsuvra has been a part of organisationals like Punj Lloyd, Tata Steel, Teach For India and The Akanksha Foundation. In an independent capacity, Somsuvra has mentored entrepreneurs and organisations, through 1-1 coaching and workshops like Umang Democratic School, The Aarambh School, Wunderschool, iVolunteer etc.",
    "linkedin": null,
    "image": null
  },
  {
    "id": "srishti-malpath",
    "name": "Srishti Malpath",
    "bio": "Srishti descends from the Gor-Banjara tribe, whose nature-based rituals around birth, death, celebration shape her way of seeing life and learning. An alumna of IIT Bombay & IIM Bangalore, she transitioned from FMCG to exploring embodied expression and awareness. Having trained in Bharatanatyam from age 6 and later in contemporary dance, movement has been her lifelong language. Past 7years, she has immersed in Yoga, Kalaripayattu, & Somatic studies, co-founding The Re-membering Collective, which curates retreats &learning programs across India, US, & soon Europe. She has worked in higher education and presented on embodied learning at the 2024 Learning & the Brain Conference, New York.",
    "linkedin": "https://www.linkedin.com/in/srishti-malpath-9942683b/",
    "image": null
  },
  {
    "id": "subhomoy-bhaduri",
    "name": "Subhomoy Bhaduri",
    "bio": "Dr. Subhomoy Bhaduri leads the Capacity Building and Collaborations vertical at Magic Bus India Foundation, aligning programmes with government priorities and fostering partnerships to scale social impact. He has advanced the Sports for Social Development agenda and contributed to national policy dialogues, including inputs for the upcoming National Sports Policy 2025. Bridging practice and policy, he builds collaborations across government, civil society, and academia to strengthen life skills education and livelihood outcomes. Passionate about sport as a catalyst for change, he champions ecosystems where young people thrive with opportunity, agency, and aspiration.",
    "linkedin": null,
    "image": null
  },
  {
    "id": "sumita-gowdety",
    "name": "Sumita Gowdety",
    "bio": "I am Sumita Gowdety, an SEL Master Trainer, Educational Psychologist, and Emotional Intelligence Coach, who believes that social-emotional learning is not an optional add-on—it is at the core of education. Over two decades, I have partnered with K–12 schools, designing SEL frameworks that support the curricula across CBSE, IB, and IGCSE boards. My work sits at the intersection of emotional intelligence, neuroscience, metacognition, contemplative sciences, social and developmental theories, Indic knowledge systems, the science of wellbeing, and leadership coaching models. I help school leaders embed SEL as a living, conscious, and compassionate practice that transforms classrooms into thriving learning communities.",
    "linkedin": null,
    "image": null
  },
  {
    "id": "tanushree-banerji",
    "name": "Tanushree Banerji",
    "bio": "Tanushree Banerji is a certified Coach, Author, Behavioural Facilitator, and Experiential Educator who designs and delivers transformative learning interventions that are business-driven in outcome, purpose-led in design, and deeply human at heart. In her 15+ years of a dynamic journey, Tanushree has partnered with organisations across industries to unlock leadership potential, ignite creativity, and translate behavioural shifts into measurable business impact. Using a mix of modalities, Tanushree creates safe and empowering spaces where individuals feel seen, heard, and inspired to grow. Tanushree is currently pursuing her ICF-ACC accreditation, continuing her commitment to expanding her impact as a coach and facilitator.",
    "linkedin": null,
    "image": null
  },
  {
    "id": "usha-krishnan",
    "name": "Usha Krishnan",
    "bio": "Usha Krishnan is an educator, certified intercultural trainer and facilitator and language specialist with over a decade of experience at the intersection of language education, cultural inclusion, and teacher development. She is deeply committed to designing learning environments that are reflective, participatory, and rooted in equity. Her work focuses on supporting educators, professionals, and learners in developing intercultural sensitivity, communicative competence and inclusive practices. She has presented and published at international forums, on themes related to experiential learning, intercultural communication, and inclusive language pedagogy. Her workshops and training modules blend theory with interactive, real-world application, making them engaging and impactful.",
    "linkedin": "http://linkedin.com/in/ushakrishnan-language-intercultural-coach-storyteller",
    "image": null
  },
  {
    "id": "vivek-yatnalkar",
    "name": "Vivek Yatnalkar",
    "bio": "Vivek Yatnalkar is an experiential learning designer, executive coach, and facilitator with over three decades of experience in corporate leadership roles, leadership and organizational development. As Senior member of Meeraq Leadership Team, he advocates the use of immersive learning methods to create transformative experiences for leaders and teams. Vivek has designed and delivered programs for global organizations across manufacturing, pharma, IT, and services sectors, focusing on human leadership, strategic thinking, and culture transformation. Known for his engaging facilitation style, he integrates insights from behavioral science, systems thinking, and experiential methodologies to drive real, sustainable change in people and organizations.",
    "linkedin": "https://www.linkedin.com/in/vivekyatnalkar/",
    "image": null
  },
  {
    "id": "yateen-gharat",
    "name": "Yateen Gharat",
    "bio": "Yateen Gharat is the CEO of Pro-Fac Professional Facilitators and MD at Outdoor Adventure Management. An IAF Certified Professional Master Facilitator (CPF | M), he has 25 years of experience in leadership, learning and development, and adventure survival. Yateen has delivered over 3,800 corporate workshops, designed the Transformational Facilitation Skills (TTF) program, and co-authored 'Fast Forward To Facilitation.' He holds multiple certifications, serves as a Visiting Faculty at TISS, and sits on the board of six HR companies. Leveraging his adventure expertise, he integrates experiential learning to deliver impactful leadership and change management programs globally.",
    "linkedin": "https://www.linkedin.com/in/yateengharatcpfmaster?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    "image": null
  },
  {
    "id": "zuhail-babu-p",
    "name": "Zuhail Babu. P",
    "bio": "Zuhail Babu. P is an Experiential Educator and Expressive Arts Therapist from India whose work focuses on humanizing systems of learning and leadership. He designs and facilitates experiences that help people reconnect with themselves and others through play, reflection, and embodied presence. Over the past decade, he has worked with educators, corporate teams, and youth across India, including collaborations with UNICEF. Drawing from experiential learning, somatic awareness, and creative expression, Suhail supports facilitators and leaders to cultivate presence, compassion, and authenticity in the spaces they create.",
    "linkedin": "www.linkedin.com/in/zuhailbabu",
    "image": null
  },
  {
    "id": "nidhi-mittal",
    "name": "Nidhi Mittal",
    "bio": "Nidhi Mittal is a design wizard, passionate and innovative UI/UX Designer, brimming with fresh perspectives and an unwavering commitment to crafting immersive digital experiences. She dig in into every project with zeal, seeking to shape interfaces that transcend expectations. As a newcomer to this enchanting realm, she is thrilled to embark on this exhilarating journey of growth, eager to transform challenges into opportunities and dreams into awe-inspiring realities.",
    "linkedin": null,
    "image": null
  },
  {
    "id": "nidhi-chavan",
    "name": "Nidhi Chavan",
    "bio": "Nidhi is an old soul from the city of Pune. As a child she was first introduced to 'Kathak'- a classical Indian dance form by her late grandmother and second to painting. Nidhi has pursued her bachelors' in psychology and in education along with a course in graphology. At her core, she has always had the persona of a teacher, teaching kids in a school, facilitating short graphology workshops. Eventually, her two worlds of Art and Teaching merged in the form of graphic facilitation at ARC (Adi Raheja and Co) where she currently contributes in designing L&OD interventions.",
    "linkedin": null,
    "image": null
  },
  {
    "id": "aaryan-sen",
    "name": "Aaryan Sen",
    "bio": "Aaryan is a sportsman at heart who has pursued cricket at a professional level for over a decade. With interests in multiple fields like sports, psychology, branding, marketing, coaching and community building- he personifies a Renaissance Soul. Within one 10 minute conversation with him you'll experience his child like curiosity and philosopher like depth. Currently he's pursuing his degree MSc in Marketing through the Imperial Business School while working at ARC (Adi Raheja and Co) as a Branding and Strategy mentor.",
    "linkedin": null,
    "image": null
  },
  {
    "id": "junaid-hussain",
    "name": "Junaid Hussain",
    "bio": "Junaid Hussain is a business management graduate with over 18 years of experience in relationship management, team leadership, and program facilitation. Since 2009, he has led the Business Development and Sales functions at Inme Learning and Youreka, driving growth and expanding the reach of experiential learning across India. Junaid facilitates transformative training programs focused on teamwork, communication, and leadership for corporate executives, as well as life skills programs for children. His work includes engagements with leading organizations such as Pepsi, Timken, Oracle, ICICI, Ericsson, and Abbott, and educational institutions like The Doon School.",
    "linkedin": null,
    "image": null
  },
  {
    "id": "prachi-dalal",
    "name": "Prachi Dalal",
    "bio": "Prachi Dalal has delved into education, heritage and arts programming, using a multi-disciplinary approach to her work in a variety of spaces such as museums, classrooms, arts and heritage organisations, and the world as a classroom. She enjoys nurturing curiosity, inquiry, creativity, critical thinking, problem solving and exploration through inquiry-based, place-based, project-based and experiential learning pedagogies. While designing her learning experiences, she provides opportunities for learners to have agency, and feel empowered to become researchers, designers, change makers, innovators, entrepreneurs, critical thinkers, and empathetic citizens of local and global communities.",
    "linkedin": null,
    "image": null
  }
];

async function seedSpeakers() {
  const speakersCollection = collection(db, 'speakers');

  try {
    // Delete existing speakers
    const existingSpeakers = await getDocs(speakersCollection);
    let deletedCount = 0;
    for (const docSnap of existingSpeakers.docs) {
      await deleteDoc(doc(db, 'speakers', docSnap.id));
      deletedCount++;
    }
    console.log(`🗑️  Deleted ${deletedCount} old speakers`);

    // Upload new speakers
    const batch = writeBatch(db);
    speakers.forEach((speaker) => {
      const docRef = doc(speakersCollection, speaker.id);
      batch.set(docRef, speaker);
    });

    await batch.commit();
    console.log(`✅ Successfully uploaded ${speakers.length} speakers with LinkedIn links to Firestore!`);
    
    console.log('\nSample speakers uploaded:');
    speakers.slice(0, 3).forEach(s => {
      console.log(`  - ${s.name} ${s.linkedin ? '(LinkedIn: ' + s.linkedin + ')' : '(No LinkedIn)'}`);
    });
  } catch (error) {
    console.error('❌ Error seeding speakers:', error);
    process.exit(1);
  }
}

seedSpeakers();
