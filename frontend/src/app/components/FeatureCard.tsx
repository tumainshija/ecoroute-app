interface Props {
    title: string;
    description: string;
  }
  
  export default function FeatureCard({ title, description }: Props) {
    return (
      <div className="bg-white p-6 shadow-lg rounded-xl">
        <h3 className="text-xl font-bold text-green-800">{title}</h3>
        <p className="text-green-700 mt-2">{description}</p>
      </div>
    );
  }
  