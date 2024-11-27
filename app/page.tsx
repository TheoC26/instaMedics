import DynamicForm from "../components/DynamicForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">
            Insta Medics Service Request
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for considering Instamedics for your upcoming project's
            medical needs. In order to check our availability and generate an
            accurate quote, we'll need to collect some details about you and
            your project.
          </p>
          <DynamicForm />
        </div>
      </div>
    </div>
  );
}
