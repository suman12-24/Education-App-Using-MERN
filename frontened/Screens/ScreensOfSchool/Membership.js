import { StyleSheet, Text, View, TouchableOpacity, ScrollView, StatusBar, Image } from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Dimensions } from 'react-native';
import { Animated } from 'react-native';

const { width } = Dimensions.get('window');

// Enhanced Academic Subscription Card Component
const SubscriptionPlan = ({ title, price, features, primaryColor, secondaryColor, isPopular, icon }) => {
    const [scaleAnim] = useState(new Animated.Value(1));

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.97,
            friction: 5,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View
            style={[
                styles.cardContainer,
                { transform: [{ scale: scaleAnim }] }
            ]}
        >
            {isPopular && (
                <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>RECOMMENDED</Text>
                </View>
            )}

            <LinearGradient
                colors={[primaryColor, secondaryColor]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.card, isPopular && styles.popularCard]}
            >
                <View style={styles.iconContainer}>
                    <Text style={styles.iconText}>{icon}</Text>
                </View>

                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{title}</Text>
                    <View style={styles.priceContainer}>
                        <Text style={styles.dollarSign}>₹</Text>
                        <Text style={styles.cardPrice}>{price}</Text>
                        <Text style={styles.cardPeriod}>/month</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.cardBody}>
                    {features.map((feature, index) => (
                        <View key={index} style={styles.featureItem}>
                            <View style={styles.checkCircle}>
                                <Text style={styles.checkmark}>✓</Text>
                            </View>
                            <Text style={styles.featureText}>{feature}</Text>
                        </View>
                    ))}
                </View>

                <TouchableOpacity
                    style={[
                        styles.button,
                        { backgroundColor: isPopular ? '#fff' : 'rgba(255, 255, 255, 0.25)' }
                    ]}
                    activeOpacity={0.9}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                >
                    <Text style={[
                        styles.buttonText,
                        { color: isPopular ? secondaryColor : '#fff' }
                    ]}>
                        SELECT PLAN
                    </Text>
                </TouchableOpacity>
            </LinearGradient>
        </Animated.View>
    );
};

// Benefits Card Component
const BenefitCard = ({ icon, title, description }) => {
    return (
        <View style={styles.benefitCard}>
            <Text style={styles.benefitIcon}>{icon}</Text>
            <Text style={styles.benefitTitle}>{title}</Text>
            <Text style={styles.benefitDescription}>{description}</Text>
        </View>
    );
};

// FAQ Item Component with Accordion
const FAQItem = ({ question, answer }) => {
    const [expanded, setExpanded] = useState(false);
    const [heightAnim] = useState(new Animated.Value(0));

    const toggleExpand = () => {
        if (expanded) {
            Animated.timing(heightAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(heightAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
        setExpanded(!expanded);
    };

    return (
        <View style={styles.faqItem}>
            <TouchableOpacity style={styles.faqHeader} onPress={toggleExpand}>
                <Text style={styles.faqQuestion}>{question}</Text>
                <Text style={styles.faqToggle}>{expanded ? '−' : '+'}</Text>
            </TouchableOpacity>
            <Animated.View
                style={[
                    styles.faqBody,
                    {
                        height: heightAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 100]
                        }),
                        opacity: heightAnim
                    }
                ]}
            >
                <Text style={styles.faqAnswer}>{answer}</Text>
            </Animated.View>
        </View>
    );
};

const EducationSubscription = () => {
    const subscriptionPlans = [
        {
            title: 'BASIC',
            price: '299',
            primaryColor: '#4F46E5',
            secondaryColor: '#7C3AED',
            isPopular: false,
            icon: '📚',
            features: [
                'Up to 500 student accounts',
                'Basic learning analytics',
                'Standard support (24h response)',
                'Core educational modules',
                'Parent-teacher communication'
            ]
        },
        {
            title: 'STANDARD',
            price: '499',
            primaryColor: '#0EA5E9',
            secondaryColor: '#0D9488',
            isPopular: true,
            icon: '🎓',
            features: [
                'Up to 1,500 student accounts',
                'Advanced learning analytics',
                'Priority support (12h response)',
                'All educational modules',
                'Parent-teacher communication',
                'Customizable dashboards',
                'Homework management system'
            ]
        },
        // {
        //     title: 'PREMIUM',
        //     price: '999',
        //     primaryColor: '#F59E0B',
        //     secondaryColor: '#EF4444',
        //     isPopular: false,
        //     icon: '🏫',
        //     features: [
        //         'Unlimited student accounts',
        //         'Comprehensive analytics suite',
        //         'Dedicated support manager',
        //         'All educational modules',
        //         'Advanced communication system',
        //         'Customizable dashboards',
        //         'Homework management system',
        //         'Multi-campus support',
        //         'API access for custom integrations'
        //     ]
        // }
    ];

    const benefits = [
        {
            icon: '📊',
            title: 'Data-Driven Insights',
            description: 'Track student progress with comprehensive analytics and reporting tools'
        },
        {
            icon: '🔄',
            title: 'Seamless Integration',
            description: 'Easily connects with your existing school management systems'
        },
        {
            icon: '👨‍👩‍👧‍👦',
            title: 'Parent Engagement',
            description: 'Keep parents involved with real-time updates on student performance'
        },
        {
            icon: '🛡️',
            title: 'Secure & Compliant',
            description: 'FERPA and COPPA compliant with enterprise-grade security'
        }
    ];

    const faqs = [
        {
            question: 'How is billing handled for schools?',
            answer: 'Schools can choose annual billing with a 15% discount or monthly billing. We accept purchase orders and provide flexible payment options for educational institutions.'
        },
        {
            question: 'Can we upgrade our plan mid-year?',
            answer: 'Yes, you can upgrade your plan at any time. The price difference will be prorated for the remainder of your billing cycle.'
        },
        {
            question: 'Is technical training included?',
            answer: 'All plans include basic onboarding. Standard and Premium plans include comprehensive training sessions for staff.'
        },
        {
            question: 'How do you handle student data privacy?',
            answer: 'We adhere to all educational privacy standards including FERPA and COPPA. Your student data is encrypted and never shared with third parties.'
        }
    ];

    return (
        <View style={styles.container}>


            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.header}>

                    <Text style={styles.title}>Educational Subscription Plans</Text>
                    <Text style={styles.subtitle}>Empower your school with our comprehensive digital learning platform</Text>
                </View>

                {subscriptionPlans.map((plan, index) => (
                    <SubscriptionPlan
                        key={index}
                        title={plan.title}
                        price={plan.price}
                        features={plan.features}
                        primaryColor={plan.primaryColor}
                        secondaryColor={plan.secondaryColor}
                        isPopular={plan.isPopular}
                        icon={plan.icon}
                    />
                ))}

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Why Schools Choose Us</Text>
                    <Text style={styles.sectionSubtitle}>Trusted by over 500+ educational institutions worldwide</Text>
                </View>

                <View style={styles.benefitsContainer}>
                    {benefits.map((benefit, index) => (
                        <BenefitCard
                            key={index}
                            icon={benefit.icon}
                            title={benefit.title}
                            description={benefit.description}
                        />
                    ))}
                </View>

                <View style={styles.promoContainer}>
                    <LinearGradient
                        colors={['#1E293B', '#0F172A']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.promoGradient}
                    >
                        <View style={styles.promoContent}>
                            <View style={styles.promoBadge}>
                                <Text style={styles.promoBadgeText}>LIMITED TIME</Text>
                            </View>
                            <Text style={styles.promoTitle}>ACADEMIC YEAR SPECIAL</Text>
                            <Text style={styles.promoText}>
                                Subscribe before the school year starts and get 3 months free with any annual plan
                            </Text>
                            <TouchableOpacity style={styles.promoButton}>
                                <Text style={styles.promoButtonText}>GET SCHOOL OFFER</Text>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
                </View>

                <View style={styles.faqContainer}>
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                        />
                    ))}
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Need a custom solution for your district?</Text>
                    <TouchableOpacity style={styles.contactButton}>
                        <Text style={styles.contactButtonText}>SCHEDULE CONSULTATION</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <View style={{ height: 100 }} />
        </View>
    );
};

export default EducationSubscription;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollContent: {
        paddingBottom: 20,
    },
    header: {
        paddingHorizontal: 18,
        paddingTop: 18,
        paddingBottom: 10,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748B',
        marginBottom: 10,
        lineHeight: 20,
    },
    sectionHeader: {
        paddingHorizontal: 22,
        paddingTop: 5,
        paddingBottom: 5,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 5,
    },
    sectionSubtitle: {
        fontSize: 16,
        color: '#64748B',
        marginBottom: 10,
    },
    cardContainer: {
        marginHorizontal: 18,
        marginBottom: 22,
        position: 'relative',
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    popularBadge: {
        position: 'absolute',
        top: -10,
        right: 22,
        backgroundColor: '#000',
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 18,
        zIndex: 10,
    },
    popularText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    card: {
        borderRadius: 24,
        padding: 15,
        overflow: 'hidden',
    },
    popularCard: {
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    iconContainer: {
        width: 55,
        height: 55,
        borderRadius: 55 / 2,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    iconText: {
        fontSize: 30,
    },
    cardHeader: {
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 1,
        opacity: 0.9,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginTop: 5,
    },
    dollarSign: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    cardPrice: {
        fontSize: 35,
        fontWeight: 'bold',
        color: '#fff',
    },
    cardPeriod: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.8,
        marginBottom: 5,
        marginLeft: 4,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginBottom: 10,
    },
    cardBody: {
        marginBottom: 10,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    checkCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        marginTop: 2,
    },
    checkmark: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    featureText: {
        fontSize: 16,
        color: '#fff',
        flex: 1,
        lineHeight: 24,
    },
    button: {
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    benefitsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 12,
        justifyContent: 'space-between',
    },
    benefitCard: {
        width: (width - 56) / 2,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 4,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
        alignItems: 'center',
    },
    benefitIcon: {
        fontSize: 32,
        marginBottom: 12,
    },
    benefitTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 8,
        textAlign: 'center',
    },
    benefitDescription: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 20,
    },
    promoContainer: {
        marginHorizontal: 24,
        marginVertical: 24,
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    promoGradient: {
        borderRadius: 24,
    },
    promoContent: {
        padding: 24,
        alignItems: 'center',
    },
    promoBadge: {
        backgroundColor: '#6366F1',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 16,
    },
    promoBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    promoTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 12,
        letterSpacing: 1,
    },
    promoText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24,
        opacity: 0.9,
    },
    promoButton: {
        backgroundColor: '#fff',
        paddingVertical: 16,
        paddingHorizontal: 36,
        borderRadius: 16,
    },
    promoButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
        letterSpacing: 1,
    },
    faqContainer: {
        marginHorizontal: 24,
    },
    faqItem: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
    },
    faqHeader: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    faqQuestion: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B',
        flex: 1,
    },
    faqToggle: {
        fontSize: 24,
        fontWeight: '200',
        color: '#6366F1',
        marginLeft: 16,
    },
    faqBody: {
        overflow: 'hidden',
    },
    faqAnswer: {
        padding: 20,
        paddingTop: 0,
        fontSize: 15,
        color: '#64748B',
        lineHeight: 22,
    },
    footer: {
        marginTop: 14,
        paddingTop: 14,
        paddingBottom: 10,
        paddingHorizontal: 24,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    footerText: {
        fontSize: 16,
        color: '#64748B',
        marginBottom: 10,
    },
    contactButton: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: '#0F172A',
        borderRadius: 16,
    },
    contactButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
        letterSpacing: 1,
    }
});