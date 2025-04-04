
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { MessageSquare, ExternalLink, Tag, Webhook, Clock } from 'lucide-react';

const ActionNode = ({ data, selected }) => {
  // Select icon based on action type
  const renderIcon = () => {
    switch (data.type) {
      case 'show_message':
        return <MessageSquare className="h-4 w-4 mr-2" />;
      case 'redirect':
        return <ExternalLink className="h-4 w-4 mr-2" />;
      case 'tag_user':
        return <Tag className="h-4 w-4 mr-2" />;
      case 'webhook':
        return <Webhook className="h-4 w-4 mr-2" />;
      case 'wait':
        return <Clock className="h-4 w-4 mr-2" />;
      default:
        return <MessageSquare className="h-4 w-4 mr-2" />;
    }
  };

  // Render property summary
  const renderPropertySummary = () => {
    switch (data.type) {
      case 'show_message':
        return data.properties?.templateId 
          ? `Template: ${data.properties.templateId === 't1' ? 'Welcome Message' : 
              data.properties.templateId === 't2' ? 'Special Offer' : 
              data.properties.templateId === 't3' ? 'Feature Announcement' : 
              data.properties.templateId}`
          : 'No template selected';
      case 'redirect':
        return data.properties?.url ? `URL: ${data.properties.url}` : 'No URL set';
      case 'tag_user':
        return data.properties?.tag ? `Tag: ${data.properties.tag}` : 'No tag set';
      case 'webhook':
        return data.properties?.webhookUrl ? `URL: ${data.properties.webhookUrl}` : 'No webhook URL set';
      case 'wait':
        if (data.properties?.duration && data.properties?.unit) {
          return `Wait: ${data.properties.duration} ${data.properties.unit}`;
        }
        return 'Wait duration not set';
      default:
        return '';
    }
  };

  return (
    <div className={`p-3 rounded-md min-w-[200px] ${selected ? 'ring-2 ring-secondary' : ''}`}>
      <Handle
        type="target"
        position={Position.Top}
      />
      
      <div className="flex flex-col">
        <div className="flex items-center mb-1">
          {renderIcon()}
          <span className="font-medium">{data.label}</span>
        </div>
        
        {data.description && (
          <p className="text-xs text-muted-foreground mb-1">{data.description}</p>
        )}
        
        <p className="text-xs mt-1 text-secondary">{renderPropertySummary()}</p>
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
      />
    </div>
  );
};

export default memo(ActionNode);
