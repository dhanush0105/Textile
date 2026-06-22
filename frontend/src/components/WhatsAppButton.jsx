import React from 'react';

const WhatsAppButton = () => {
  const phoneNumber = '919876543210';
  const message = 'Hello Anusree Tex, I am looking for premium traditional veshtis. Can you help me?';

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      style={{ zIndex: 1000 }}
      className="fixed bottom-6 right-6 bg-[#25D366] hover:bg-[#20BA5A] text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none flex items-center justify-center animate-pulse"
      title="Chat with us on WhatsApp"
    >
      <svg
        className="w-6 h-6 fill-current"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.748.002-2.607-1.01-5.059-2.85-6.902C16.643 2.062 14.195 1.05 11.59 1.05 6.158 1.05 1.734 5.42 1.732 10.797c-.001 1.702.469 3.364 1.358 4.842l-.993 3.629 3.793-.981l.169.102zM17.47 14.8c-.322-.16-1.905-.939-2.2-.104-.294.167-.508.939-.623 1.077-.113.138-.228.154-.55.006-.322-.16-1.36-.5-2.59-1.602-.958-.853-1.604-1.907-1.792-2.228-.188-.321-.02-.495.14-.654.146-.143.32-.373.482-.56.16-.188.214-.321.321-.535.109-.214.054-.4-.027-.56-.08-.16-.768-1.848-1.054-2.535-.278-.669-.562-.578-.769-.588l-.657-.013c-.228 0-.598.085-.91.424-.313.339-1.196 1.168-1.196 2.848 0 1.68 1.225 3.3 1.396 3.532.172.23 2.41 3.676 5.839 5.151.815.351 1.451.561 1.948.718.818.259 1.562.222 2.15.134.656-.098 1.905-.778 2.174-1.493.27-.715.27-1.33.188-1.46-.08-.13-.294-.21-.616-.37z" />
      </svg>
    </button>
  );
};

export default WhatsAppButton;
