import Card from '@/components/Card.jsx';
import data from '@/helpers/data.json';

export default function List() {
  const scrollbarStyles =
    'scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-gray-100';

  return (
    <div className={`flex overflow-x-auto ${scrollbarStyles} h-screen`}>
      <div className='flex space-x-4'>
        {data.list.map((column, index) => (
          <div className='w-[28rem] bg-gray-100 h-screen' key={index}>
            <div className='flex items-center justify-between px-2 h-16'>
              <div className='flex items-center space-x-2'>
                <div
                  className={`w-5 h-6 ${
                    column.name === 'Incomplete' ? 'bg-red-600' : ''
                  } ${column.name === 'To Do' ? 'bg-blue-400' : ''} ${
                    column.name === 'Doing' ? 'bg-yellow-400' : ''
                  } rounded-l-full`}
                ></div>
                <span className='text-gray-800 font-semibold leading-7'>
                  {column.name}
                </span>
              </div>
              <div className='text-gray-800 leading-7 px-2 py-1 rounded-lg flex items-center justify-center bg-gray-200 font-medium'>
                {column.list.length}
              </div>
            </div>
            <div
              className={`space-y-4 overflow-y-auto px-2 ${scrollbarStyles} h-[calc(100%-4rem)] pb-28`}
            >
              {column.list.map((cardItem, cardIndex) => (
                <Card key={cardIndex} item={cardItem} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
