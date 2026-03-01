import { LucideShieldCheck, LucideCode2, LucideUsers, LucideActivity } from 'lucide-react';

const trustItems = [
    {
        icon: <LucideShieldCheck className="w-12 h-12 text-green-400 mb-4 mx-auto" />,
        title: "Institutional Credibility",
        desc: "Used by top universities to evaluate true coding potential beyond grades."
    },
    {
        icon: <LucideCode2 className="w-12 h-12 text-indigo-400 mb-4 mx-auto" />,
        title: "Project-Based Reality",
        desc: "We test logic, optimization, and style. Not LeetCode memorization."
    },
    {
        icon: <LucideActivity className="w-12 h-12 text-yellow-400 mb-4 mx-auto" />,
        title: "Growth Trajectory",
        desc: "We predict how fast a developer learns new frameworks, not just what they know today."
    },
    {
        icon: <LucideUsers className="w-12 h-12 text-purple-400 mb-4 mx-auto" />,
        title: "Bias-Free Hiring",
        desc: "Zero name, gender, or university bias. Pure skill data exposed directly to recruiters."
    }
];

export default function TrustBuilder() {
    return (
        <section className="py-24 bg-gray-950 text-white relative">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent opacity-50" />

            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Why the World Trusts <span className="text-indigo-500">Skill DNA</span></h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Traditional hiring is broken. We fix it by providing verified, unforgeable data on developer capability.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {trustItems.map((item, idx) => (
                        <div key={idx} className="bg-gray-900/50 border border-gray-800 p-8 rounded-2xl hover:border-indigo-500/50 transition-colors group">
                            <div className="bg-gray-800/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-center text-white">{item.title}</h3>
                            <p className="text-gray-400 text-sm text-center leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
