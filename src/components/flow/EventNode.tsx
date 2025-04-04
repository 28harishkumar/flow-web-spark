
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Bell, Calendar, Clock, MousePointer, ScrollText } from 'lucide-react';

const EventNode = ({ data, selected }) => {
  // Select icon based on event type
  const renderIcon = () => {
    switch (data.type) {
      case 'page_view':
        return <ScrollText className="h-4 w-4 mr-2" />;
      case 'button_click':
        return <MousePointer className="h-4 w-4 mr-2" />;
      case 'form_submit':
        return <ScrollText className="h-4 w-4 mr-2" />;
      case 'time_spent':
        return <Clock className="h-4 w-4 mr-2" />;
      case 'scroll_depth':
        return <ScrollText className="h-4 w-4 mr-2" />;
      case 'start':
        return <Bell className="h-4 w-4 mr-2" />;
      default:
        return <Calendar className="h-4 w-4 mr-2" />;
    }
  };

  // Render property summary
  const renderPropertySummary = () => {
    switch (data.type) {
      case 'page_view':
        return data.properties?.urlPattern ? `URL: ${data.properties.urlPattern}` : 'No URL pattern set';
      case 'button_click':
        return data.properties?.buttonSelector ? `Selector: ${data.properties.buttonSelector}` : 'No button selector set';
      case 'form_submit':
        return data.properties?.formSelector ? `Form: ${data.properties.formSelector}` : 'No form selector set';
      case 'time_spent':
        return data.properties?.seconds ? `${data.properties.seconds} seconds` : 'Time not set';
      case 'scroll_depth':
        return data.properties?.percentage ? `${data.properties.percentage}% scroll depth` : 'Percentage not set';
      default:
        return '';
    }
  };

  return (
    <div className={`p-3 rounded-md min-w-[200px] ${selected ? 'ring-2 ring-primary' : ''}`}>
      <Handle
        type="target"
        position={Position.Top}
        style={{ visibility: data.type === 'start' ? 'hidden' : 'visible' }}
      />
      
      <div className="flex flex-col">
        <div className="flex items-center mb-1">
          {renderIcon()}
          <span className="font-medium">{data.label}</span>
        </div>
        
        {data.description && (
          <p className="text-xs text-muted-foreground mb-1">{data.description}</p>
        )}
        
        {data.type !== 'start' && (
          <p className="text-xs mt-1 text-primary">{renderPropertySummary()}</p>
        )}
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
      />
    </div>
  );
};

export default memo(EventNode);
