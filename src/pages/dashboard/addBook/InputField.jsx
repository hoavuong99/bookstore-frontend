/* eslint-disable react/prop-types */

const InputField = ({ label, name, type = 'text', register, placeholder }) => {
  if (type === 'textarea') {
    return (
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700">{label}</label>
        <textarea
          {...register(name, { required: true })}
          className="p-2 border w-full rounded-md focus:outline-none focus:ring focus:border-blue-300"
          placeholder={placeholder}
          rows={4}
        />
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      <input
        type={type}
        {...register(name,  { required: true })}
        className=" p-2 border w-full rounded-md focus:outline-none focus:ring focus:border-blue-300"
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputField;