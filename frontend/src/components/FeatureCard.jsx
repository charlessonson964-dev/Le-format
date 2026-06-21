export default function FeatureCard({ icon, title, desc }) {
    return (
        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-center">
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="font-bold text-blue-600 mb-2">{title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
        </div>
    );
}