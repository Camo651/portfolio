import React, { use, useEffect, useRef, useState } from 'react';
import { motion, MotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from 'motion/react';
import { MdOutlineArrowUpward, MdOutlineLaunch, MdOutlinePauseCircle, MdOutlinePlayCircle } from 'react-icons/md';
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';
import { useDebouncedCallback, useDocumentVisibility, useInViewport, useMediaQuery, useNetwork, usePageLeave, useTextSelection, useThrottledCallback, useViewportSize } from '@mantine/hooks';
import { FaceSVG } from '../components/Face';
import { track } from '@/utils/track';

const TEXT_COLOR = '#0c2427';
const BKG_COLOR = '#ccf0f5';
const PRIMARY_COLOR = '#2f6369';
const PRIMARY_COLOR_TEXT = '#b4d8ddff';
const SECONDARY_COLOR = '#95a5a7ff';
const ACCENT_COLOR = '#f6943f';

const INIT_ANIM_DUR = 2;

type ItemType = {
    title: string;
    thumbnail: string;
    description: string;
    skills: string[];
    link?: string;
};

const items: ItemType[] = [
    {
        title: 'Terrazzo',
        thumbnail: '/assets/terrazzo.png',
        description: 'Terrazzo is a full-stack project management application originally built to streamline team operations at Mosaiq Software. Dissatisfied with existing tools like Trello or Jira, we designed Terrazzo as a customizable, real-time solution tailored for small teams.\n\nWhat began as an internal project quickly grew into a robust platform, leading us to release it publicly. The system features real-time task updates, role-based permissions, and customizable project boards, making it adaptable to different workflows. I directed a 17-member development team, managed project roadmaps, and oversaw both frontend and backend architecture.\n\nCompared to Trello, our benchmarking showed Terrazzo reduced management overhead by 260%. Today, Terrazzo serves as both a professional-grade tool for industry teams and a case study in how student-led innovation can compete with commercial standards.',
        skills: ['React', 'TypeScript', 'Node.js', 'System Architecture', 'Team Leadership'],
        link: 'https://terrazzo.mosaiq.dev/',
    },
    {
        title: 'Action Performance Tracker',
        thumbnail: '/assets/apt.png',
        description: 'The Action Performance Tracker (APT) is a smart-link and QR code tracking platform designed to optimize marketing campaigns across multiple channels. Its goal was to give marketers the ability to understand how users moved between print, social, and digital campaigns in real time, a feature often locked behind expensive enterprise tools.\n\nI architected the backend to capture omnichannel user journeys and provide dynamic dashboards for analytics. The system automatically tracked conversion funnels, link performance, and user demographics. This data allowed clients to measure ROI and adjust campaigns on the fly. APT was built under a tight timeline of just 1 month, requiring rapid iteration and careful data pipeline design.',
        skills: ['React', 'Node.js', 'Data Analysis', 'User Research'],
    },
    {
        title: 'Smartwands',
        thumbnail: '/assets/smartwands.png',
        description: 'Smartwands (Smartphone Wound Analysis and Decision Support) is a clinical decision-support app funded by the NIH.\n\nI worked as a software engineer on the project, initially developing clinician-facing mobile interfaces in React Native and supporting backend services in Python/Flask. A major part of my role was ensuring the system’s architecture and data handling aligned with FDA SaMD compliance standards, building on more than a decade of prior medical research. This included implementing secure data flows, establishing regulatory-grade development practices, and supporting integration into long-term clinical workflows.\n\nThrough Smartwands, I gained hands-on experience delivering healthcare software where compliance, security, and usability were mission-critical.',
        skills: ['React Native', 'AI/ML', 'Python', 'Flask', 'Typescript', 'UI/UX Design', 'FDA Compliance'],
    },
    {
        title: 'Minefolio',
        thumbnail: '/assets/minefolio.png',
        description: 'Minefolio is a professional-grade portfolio platform for Minecraft builders, designed to showcase creative work in a format that mirrors LinkedIn for the Minecraft community. It addresses a long-standing problem where world-class Minecraft builders lacked a centralized, polished way to present their builds beyond screenshots on social media.\n\nI designed and implemented a clean UI to highlight large-scale projects with professional presentation, metadata, and direct profile links. The platform supports a full custom portfolio builder tool, and integration with personal branding elements like social links. Beyond technical execution, Minefolio represents a unique intersection of gaming and professional networking, elevating Minecraft builders into recognized digital creators.',
        skills: ['React', 'Node.js', 'UI/UX Design'],
        link: 'https://minefol.io',
    },
    {
        title: 'Nodenium',
        thumbnail: '/assets/node.png',
        description: 'Nodenium is a large-scale international creative network for Minecraft engineers and voxel artists that I founded and directed for over a decade. Starting as a small private group, it grew into a professional-grade community with thousands of users across 30+ countries.\n\nI led the development of a responsive web platform in Vue.js, complete with dynamic content management and custom APIs for administration and analytics. On the backend, I architected a distributed server network that powered custom Java Minecraft servers, web services in PHP, and containerized deployments with Kubernetes and Nginx. Over time, I built a leadership structure and trained administrators to manage the growing user base, scaling the community by 814%. Nodenium not only provided a creative outlet for builders but also became a proving ground for my technical and leadership skills in systems engineering, web development, and community management.',
        skills: ['Vue.js', 'Flask', 'PHP', 'Java', 'Server Architecture', 'Organization Leadership'],
        link: 'https://nodenium.com',
    },
    {
        title: 'Cognisound',
        thumbnail: '/assets/cognisound.png',
        description: 'Cognisound is a patient support platform concept designed for individuals with Auditory Processing Disorder (APD). Traditional solutions for APD often require expensive hardware or clinical intervention, leaving a gap for accessible, day-to-day management tools. Using Design Thinking methodology, I created a mobile-first interface prototype in Figma, focusing on personalization and low-barrier entry. The app was designed to offer features like customizable sound filters, environmental listening modes, and daily support tracking.\n\nCognisound was supported by an academic research paper I published, which analyzed the current state of APD research and proposed potential technology interventions. The project highlights how thoughtful software design can address underserved clinical populations and provide solutions that improve quality of life outside traditional care pathways.',
        skills: ['Figma', 'UX Research', 'Healthcare Design', 'Patient-Centered Design'],
    },
    {
        title: 'Brigham & Womens Kiosk System',
        thumbnail: '/assets/bnw.png',
        description: 'I led the design and development of a patient kiosk system for Mass General Brigham & Women’s Hospital to improve navigation and support. The project required building a full-stack platform in React and Express, with real-time features to assist patients as they moved through the hospital. We integrated an AI-powered chatbot to answer common questions and provide wayfinding assistance. I managed an 11-member team under Agile Scrum, coordinating sprints and ensuring delivery within a two-month timeline. The final product aimed to not only improve patient flow but also reduced reliance on hospital staff for routine questions',
        skills: ['React', 'Express', 'Agile Leadership', 'AI Integration', 'Healthcare UX'],
    },
    {
        title: 'Lung Cancer Prediction Model',
        thumbnail: '/assets/lungcancer.png',
        description: 'This project involved designing a machine learning model to predict the likelihood of a patient having lung cancer based on symptoms and environmental exposures. Built in collaboration with WPI’s bioinformatics department, the system used PyTorch and Flask to train and deploy predictive models, with a focus on explainability and patient usability. On the frontend, I created a Vue.js interface that allowed patients to enter their data through a streamlined experience, reducing barriers to participation. The project showed a promising approach to using AI for early detection and personalized medicine.',
        skills: ['Python', 'PyTorch', 'Flask', 'Vue.js', 'Machine Learning'],
    },
    {
        title: 'Audio Atlas',
        thumbnail: '/assets/audioatlas.png',
        description: 'Audio Atlas is a greenfield AI-powered audio search engine built to enable intuitive discovery of sound files. Unlike traditional keyword search, Audio Atlas used a combination of vector-based sound classification and generative models to map audio into a searchable semantic space.\n\nI worked with a five-person team to build the full-stack application using Nuxt, Vue.js, and Flask. On the AI side, we developed a classifier model to process audio into embeddings and a generative AI model that allowed users to describe a sound in text and retrieve matching audio. The result was a groundbreaking proof-of-concept for how audio data could be made searchable in the same way as images or text. The system has potential applications in creative industries, archival work, and accessibility.',
        skills: ['Nuxt', 'Vue.js', 'Flask', 'AI/ML', 'Generative AI'],
        link: 'https://audio-atlas.github.io/audio-atlas-frontend/about',
    },
    {
        title: 'Syooda',
        thumbnail: '/assets/syooda.png',
        description: 'Syooda is an educational management app built during the COVID-19 pandemic to help students adapt to virtual learning. At a time when schools were rapidly shifting online, students often struggled with fragmented schedules and lack of centralized tools. I developed Syooda in C#, creating a platform that allowed students to manage assignments, track class schedules, and organize resources.\n\nThe project featured both a user-centric designed desktop app which I distributed across multiple school districts. Syooda’s impact lay in its ability to bridge gaps during a disruptive period in education, demonstrating how quickly tailored technology solutions could be deployed to meet real-world needs.',
        skills: ['C#', 'Unity', 'UI Design', 'Education Technology'],
        link: 'https://matthagger.me/apps/syooda/',
    },
    // {
    //     title: 'Flagship',
    //     thumbnail: 'https://www.example.com/thumbnail10.jpg',
    //     description: '',
    // },
    // {
    //     title: 'Logic Gates',
    //     thumbnail: 'https://www.example.com/thumbnail11.jpg',
    //     description: '',
    // },
    // {
    //     title: 'Arbolite',
    //     thumbnail: 'https://www.example.com/thumbnail12.jpg',
    //     description: '',
    // },
    // {
    //     title: 'Midnight',
    //     thumbnail: 'https://www.example.com/thumbnail12.jpg',
    //     description: '',
    // },
];

const LandingPage = () => {
    const pseudoBodyRef = useRef<HTMLDivElement>(null);
    const { scrollY, scrollYProgress } = useScroll({ container: pseudoBodyRef });
    const isLargeViewport = useMediaQuery('(min-width: 1200px)');
    const isMediumViewport = useMediaQuery('(min-width: 768px)');
    const viewPortSize = useViewportSize();
    const topTagVisibility = useTransform(scrollY, [80, 150], ['100vw', '0vw'], { clamp: true });
    const topTagColor = useTransform(scrollY, [500, 1200], [BKG_COLOR, TEXT_COLOR], { clamp: true });
    const topTagVisibleSmooth = useSpring(topTagVisibility);
    const bottomTagOpacitySmooth = useSpring(useTransform(scrollY, [80, 150], [0, 1], { clamp: true }));
    const networkStatus = useNetwork();
    const selection = useTextSelection();
    const documentState = useDocumentVisibility();

    useEffect(() => {
        track(`Entered LandingPage`);
        return () => {
            track('Unmounted LandingPage');
        };
    }, []);

    const trackVp = useThrottledCallback(() => {
        track(`Viewport Size: ${viewPortSize.width}x${viewPortSize.height}`);
    }, 10000);

    useEffect(() => {
        if (viewPortSize.width === 0 || viewPortSize.height === 0) return;
        trackVp();
    }, [viewPortSize.width, viewPortSize.height]);

    const trackScroll = useThrottledCallback(() => {
        if (pseudoBodyRef.current) {
            track(`Scroll Position: ${(pseudoBodyRef.current.scrollTop / pseudoBodyRef.current.scrollHeight) * 100}%`);
        }
    }, 2500);

    useEffect(() => {
        if (pseudoBodyRef.current) {
            pseudoBodyRef.current.addEventListener('scroll', trackScroll);
        }
        return () => {
            if (pseudoBodyRef.current) {
                pseudoBodyRef.current.removeEventListener('scroll', trackScroll);
            }
        };
    }, [trackScroll]);

    const trackNetwork = useThrottledCallback(() => {
        track(`Network Status: ${JSON.stringify(networkStatus)}`);
    }, 10000);

    useEffect(() => {
        trackNetwork();
    }, [JSON.stringify(networkStatus)]);

    const trackTextSelection = useDebouncedCallback(() => {
        if (selection && selection.toString().length > 0) {
            track(`Text Selection: ${selection?.toString()}`);
        }
    }, 1000);

    useEffect(() => {
        trackTextSelection();
    }, [selection?.toString()]);

    useEffect(() => {
        track(`Document Visibility: ${documentState}`);
    }, [documentState]);

    return (
        <div
            ref={pseudoBodyRef}
            style={{
                backgroundColor: BKG_COLOR,
                overflowX: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: '100vh',
                maxHeight: '100vh',
                height: '100vh',
                scrollSnapType: isLargeViewport ? 'y mandatory' : 'y proximity',
                scrollBehavior: 'smooth',
            }}
            onClick={(e) => {
                const id = (e.target as any).id;
                if (id) {
                    track(`Clicked on: ${id}`);
                }
            }}
            onAuxClick={(e) => {
                const id = (e.target as any).id;
                if (id) {
                    track(`Aux Clicked on: ${id}`);
                }
            }}
        >
            <motion.div
                id="Initial Animation"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: INIT_ANIM_DUR }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 10000,
                    height: '100vh',
                    width: '100vw',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: PRIMARY_COLOR,
                    pointerEvents: 'none',
                }}
            >
                <motion.div
                    initial={{ width: '0px', height: '0px' }}
                    animate={{ width: '100vw', height: '100vh' }}
                    transition={{ duration: INIT_ANIM_DUR, ease: 'easeInOut' }}
                    style={{
                        backgroundColor: BKG_COLOR,
                        borderRadius: '10000px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <motion.h1
                        style={{ color: TEXT_COLOR }}
                        initial={{ transform: 'translateY(2rem)' }}
                        animate={{ transform: 'translateY(-2rem)' }}
                        transition={{ duration: INIT_ANIM_DUR }}
                    >
                        Loading
                    </motion.h1>
                </motion.div>
            </motion.div>
            <div
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    width: '100%',
                    height: '50px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}
            >
                <motion.div
                    style={{
                        opacity: bottomTagOpacitySmooth,
                        backgroundColor: PRIMARY_COLOR,
                        height: '100%',
                        borderRadius: '100px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        paddingInline: '18px',
                    }}
                >
                    <motion.button
                        style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxSizing: 'content-box',
                        }}
                        whileHover={{
                            transform: 'translateY(-2px)',
                            borderBottom: `2px solid ${PRIMARY_COLOR_TEXT}`,
                        }}
                        onClick={() => {
                            track('Clicked GitHub Link');
                            window.open('https://github.com/Camo651', '_blank');
                        }}
                    >
                        <FaGithub
                            size={24}
                            color={PRIMARY_COLOR_TEXT}
                        />
                    </motion.button>
                    <motion.button
                        style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxSizing: 'content-box',
                        }}
                        whileHover={{
                            transform: 'translateY(-2px)',
                            borderBottom: `2px solid ${PRIMARY_COLOR_TEXT}`,
                        }}
                        onClick={() => {
                            track('Clicked LinkedIn Link');
                            window.open('https://www.linkedin.com/in/matt-hagger/', '_blank');
                        }}
                    >
                        <FaLinkedin
                            size={24}
                            color={PRIMARY_COLOR_TEXT}
                        />
                    </motion.button>
                    <motion.button
                        style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxSizing: 'content-box',
                        }}
                        whileHover={{
                            transform: 'translateY(-2px)',
                            borderBottom: `2px solid ${PRIMARY_COLOR_TEXT}`,
                        }}
                        onClick={() => {
                            track('Clicked Email Link');
                            window.open('mailto:matthagger64@gmail.com', '_blank');
                        }}
                    >
                        <FaEnvelope
                            size={24}
                            color={PRIMARY_COLOR_TEXT}
                        />
                    </motion.button>
                </motion.div>
            </div>
            <motion.div
                id="Top Tag"
                style={{
                    position: 'fixed',
                    top: '2rem',
                    right: isLargeViewport ? '2rem' : '1rem',
                    zIndex: 1000,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    pointerEvents: 'none',
                }}
            >
                <motion.div
                    style={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: isLargeViewport ? 'row' : 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        x: topTagVisibleSmooth,
                    }}
                >
                    {'MATT HAGGER'.split('').map((char, index) => {
                        return (
                            <motion.h1
                                key={index}
                                style={{
                                    fontWeight: 800,
                                    color: topTagColor,
                                    userSelect: 'none',
                                    lineHeight: '1',
                                }}
                            >
                                {char === ' ' ? '\u00A0' : char}
                            </motion.h1>
                        );
                    })}
                </motion.div>
            </motion.div>
            <motion.div
                initial={{ transform: 'translateY(-50vh)', opacity: 0 }}
                animate={{ transform: 'translateY(0)', opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 + INIT_ANIM_DUR }}
                style={{
                    scrollSnapAlign: 'start',
                    scrollSnapStop: 'normal',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    flexWrap: 'nowrap',
                    width: '102%',
                    marginLeft: '-1%',
                }}
            >
                {'MATT'.split('').map((char, index) => (
                    <motion.div
                        key={index}
                        initial={{ transform: 'translateY(-100%)' }}
                        animate={{ transform: 'translateY(-10.5vw)' }}
                        transition={{ duration: 0.5, delay: index * 0.05 + 1.25 + INIT_ANIM_DUR, type: 'spring' }}
                    >
                        <motion.h1
                            id={`MATT_${index}`}
                            initial={{ fontWeight: 100 }}
                            animate={{ fontWeight: 800 }}
                            transition={{ duration: 0.5, delay: index * 0.02 + 1.4 + INIT_ANIM_DUR }}
                            style={{
                                minWidth: '6vw',
                                fontSize: '34vw',
                                scale: 1.06,
                                color: TEXT_COLOR,
                                userSelect: 'none',
                            }}
                        >
                            {char}
                        </motion.h1>
                    </motion.div>
                ))}
            </motion.div>
            <motion.div
                initial={{ transform: 'translateY(-50vh)', opacity: 0 }}
                animate={{ transform: 'translateY(0)', opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.75 + INIT_ANIM_DUR }}
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    flexWrap: 'nowrap',
                    width: '103%',
                    marginLeft: '-.5%',
                }}
            >
                {'HAGGER'.split('').map((char, index) => (
                    <motion.div
                        key={index}
                        initial={{ transform: 'translateY(-100%)' }}
                        animate={{ transform: 'translateY(-25.1vw)' }}
                        transition={{ duration: 0.5, delay: index * 0.05 + 1.45 + INIT_ANIM_DUR, type: 'spring' }}
                    >
                        <motion.h1
                            id={`HAGGER_${index}`}
                            initial={{ fontWeight: 800 }}
                            animate={{ fontWeight: 200 }}
                            transition={{ duration: 0.5, delay: index * 0.02 + 1.65 + INIT_ANIM_DUR }}
                            style={{
                                minWidth: '6vw',
                                fontSize: '22vw',
                                scale: 1.06,
                                color: TEXT_COLOR,
                                userSelect: 'none',
                            }}
                        >
                            {char}
                        </motion.h1>
                    </motion.div>
                ))}
            </motion.div>
            <div
                style={{
                    transform: 'translateY(-30.15vw)',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <motion.div
                    initial={{ transform: 'translateY(-200vh)' }}
                    animate={{ transform: 'translateY(0)' }}
                    transition={{ duration: 0.5, delay: 0.5 + INIT_ANIM_DUR }}
                    style={{
                        scrollSnapAlign: 'center',
                        scrollSnapStop: 'normal',
                        width: '100%',
                        backgroundColor: TEXT_COLOR,
                        height: '100%',
                        minHeight: '100vh',
                        paddingBottom: '2rem',
                    }}
                >
                    <p
                        id="Tagline"
                        style={{
                            color: BKG_COLOR,
                            textAlign: 'center',
                            padding: '4rem',
                            fontSize: '2rem',
                        }}
                    >
                        {isMediumViewport ? (
                            'Developer | Designer | Creator'
                        ) : (
                            <span>
                                Developer
                                <br />
                                Designer
                                <br />
                                Creator
                            </span>
                        )}
                    </p>
                    <div
                        id="Intro section"
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'space-around',
                            width: isLargeViewport ? '100%' : '95%',
                        }}
                    >
                        <div
                            id="Face SVG"
                            style={{
                                display: isMediumViewport ? 'flex' : 'none',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: '40%',
                                minWidth: '300px',
                                maxHeight: '80vh',
                                padding: '1rem',
                            }}
                        >
                            <FaceSVG color={BKG_COLOR} />
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                            }}
                        >
                            <h2
                                id="Hi"
                                style={{
                                    fontSize: '10rem',
                                    color: BKG_COLOR,
                                    textAlign: 'left',
                                    maxWidth: '60ch',
                                    padding: '1rem',
                                }}
                            >
                                Hi,
                            </h2>
                            <p
                                id="Introduction 1"
                                style={{
                                    color: BKG_COLOR,
                                    fontSize: '1.5rem',
                                    textAlign: 'left',
                                    maxWidth: '60ch',
                                    padding: '1rem',
                                }}
                            >
                                I’m Matt — a full-stack developer who loves working across the entire spectrum of software: from user research and interface design, to writing scalable code, to spinning up servers that bring it all online.
                            </p>
                            <p
                                id="Introduction 2"
                                style={{
                                    color: BKG_COLOR,
                                    fontSize: '1.5rem',
                                    textAlign: 'left',
                                    maxWidth: '60ch',
                                    padding: '1rem',
                                }}
                            >
                                Over the years I’ve built tools for healthcare, education, and creative communities. I’m happiest when I’m learning something new while shipping real, useful products. I like to think of myself as equal parts builder, designer, and problem-solver.
                            </p>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    style={{
                        width: '95%',
                        height: '100%',
                        backgroundColor: BKG_COLOR,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '10rem',
                        paddingTop: '2rem',
                    }}
                >
                    {items.map((item, index) => {
                        return (
                            <React.Fragment key={index}>
                                <Showcase
                                    item={item}
                                    containerRef={pseudoBodyRef}
                                />
                                {index < items.length - 1 && <div style={{ height: '1px', width: '300px', backgroundColor: SECONDARY_COLOR }} />}
                            </React.Fragment>
                        );
                    })}
                    <motion.div
                        initial={{ opacity: 0, transform: 'translateY(100px)' }}
                        whileInView={{ opacity: 1, transform: 'translateY(0)' }}
                        transition={{ duration: 0.5 }}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            minHeight: '100vh',
                            scrollSnapAlign: 'start',
                            scrollSnapStop: 'normal',
                        }}
                    >
                        <h1 id="Conclusion">That&apos;s all for now!</h1>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: '100%',
                            }}
                            onClick={() => {
                                track('Clicked Back to Top');
                                pseudoBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        >
                            <p style={{ color: TEXT_COLOR, fontSize: '1rem', textAlign: 'center' }}>Back to Top</p>
                            <motion.button
                                style={{
                                    backgroundColor: 'transparent',
                                    cursor: 'pointer',
                                    width: '50px',
                                    height: '50px',
                                    border: 'none',
                                }}
                            >
                                <MdOutlineArrowUpward size={32} />
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

interface ShowcaseProps {
    item: ItemType;
    containerRef: any;
}
const Showcase = (props: ShowcaseProps) => {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        container: props.containerRef,
        offset: ['start end', 'end start'],
    });
    const y = useTransform(scrollYProgress, [0, 0.24, 1], [300, 0, -300]);
    const yMod = useSpring(y);
    const isLargeViewport = useMediaQuery('(min-width: 1200px)');

    return (
        <div
            style={{
                scrollSnapAlign: 'center',
                scrollSnapStop: 'normal',
                minHeight: '100vh',
                overflow: 'visible',
            }}
            ref={targetRef}
        >
            <motion.div
                id={`Showcase ${props.item.title} outside`}
                initial={{ opacity: 0, transform: 'translateX(100px)' }}
                whileInView={{ opacity: 1, transform: 'translateX(0)' }}
                transition={{ duration: 1.5 }}
                viewport={{ once: true }}
                style={{
                    display: 'flex',
                    flexDirection: isLargeViewport ? 'row' : 'column-reverse',
                    alignItems: 'flex-start',
                    justifyContent: 'space-around',
                    paddingTop: '6rem',
                    height: '100%',
                    width: '100%',
                    overflow: 'visible',
                    position: 'relative',
                }}
            >
                <motion.div
                    style={{
                        width: isLargeViewport ? '35%' : '85%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '1rem',
                        y: isLargeViewport ? yMod : 0,
                        height: '100%',
                    }}
                >
                    <h2
                        id={`Showcase ${props.item.title} title`}
                        style={{
                            color: TEXT_COLOR,
                            fontSize: 'max(3vw, 3rem)',
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: '2rem',
                        }}
                    >
                        {props.item.title}
                        {props.item.link && (
                            <motion.button
                                style={{
                                    backgroundColor: 'transparent',
                                    cursor: 'pointer',
                                    border: 'none',
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.2, ease: 'easeInOut' }}
                            >
                                <a
                                    href={props.item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => track(`Clicked Link for ${props.item.title}`)}
                                >
                                    <MdOutlineLaunch
                                        style={{
                                            color: SECONDARY_COLOR,
                                            fontSize: '1.5rem',
                                        }}
                                    />
                                </a>
                            </motion.button>
                        )}
                    </h2>
                    <p
                        id={`Showcase ${props.item.title} description`}
                        style={{
                            color: TEXT_COLOR,
                            fontSize: 'max(1vw, 1rem)',
                        }}
                    >
                        <span dangerouslySetInnerHTML={{ __html: props.item.description.replace(/\n/g, '<br />') }} />
                    </p>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            alignItems: 'flex-start',
                            gap: '.5rem',
                        }}
                    >
                        {props.item.skills.map((skill, index) => (
                            <h1
                                id={`Showcase ${props.item.title} skill ${index}`}
                                key={index}
                                style={{
                                    color: PRIMARY_COLOR,
                                    fontSize: '.75rem',
                                    fontWeight: '600',
                                    border: `1px solid ${PRIMARY_COLOR}`,
                                    borderRadius: '8px',
                                    padding: '0.25rem 0.5rem',
                                }}
                            >
                                {skill}
                            </h1>
                        ))}
                    </div>
                </motion.div>
                <motion.img
                    id={`Showcase ${props.item.title} thumbnail`}
                    initial={{ filter: 'drop-shadow(0 0 0 rgba(0, 0, 0, 0))' }}
                    whileHover={{ filter: `drop-shadow(-1px 1px 2px ${PRIMARY_COLOR})` }}
                    transition={{ duration: 0.2 }}
                    src={props.item.thumbnail}
                    width={isLargeViewport ? '55%' : '85%'}
                    style={{
                        objectFit: 'cover',
                        borderRadius: '8px',
                    }}
                />
            </motion.div>
        </div>
    );
};

export default LandingPage;
