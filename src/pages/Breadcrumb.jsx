import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const Breadcrumb = ({ type = 'property', property, magazineId }) => {
  let breadcrumbItems = [];

  if (type === 'blog') {
    breadcrumbItems = [
      { label: 'Home', path: '/' },
      { label: 'Magazine', path: '/magazine' }, // Link to the magazine page
     // Current page (magazine id), not a link
    ];
  } else if (property) {
    // Property page logic (only if property is defined)
    let typeLabel, typePath;
    switch (property.propertytype) {
      case 'Penthouse':
        typeLabel = 'Penthouse';
        typePath = '/penthouses';
        break;
      case 'Luxury Collectibles':
        typeLabel = 'Luxury Collectible ';
        typePath = '/listedcollectibles';
        break;
      case 'Mansion':
      default:
        typeLabel = 'Mansion';
        typePath = '/mansions';
        break;
    }

    breadcrumbItems = [
      { label: 'Home', path: '/' },
      { label: typeLabel, path: typePath },
      { label: property.reference || 'N/A', path: null }, // Current page, not a link
    ];
  } else {
    // Fallback if property is undefined and type is not 'blog'
    breadcrumbItems = [
      { label: 'Home', path: '/' },
      { label: 'Property', path: null }, // Fallback label
    ];
  }

  return (
    <nav className="flex items-center text-sm font-inter text-gray-600 mb-6">
      <ul className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.path ? (
              <Link
                to={item.path}
                className="text-[#00603A] hover:underline"
                dangerouslySetInnerHTML={{
                  __html: item.label.length > 30 ? `${item.label.substring(0, 30)}...` : item.label,
                }}
              />
            ) : (
              <span
                className="text-gray-800"
                dangerouslySetInnerHTML={{
                  __html: item.label.length > 30 ? `${item.label.substring(0, 30)}...` : item.label,
                }}
              />
            )}
            {index < breadcrumbItems.length - 1 && (
              <span className="mx-2 text-gray-400">></span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Breadcrumb;