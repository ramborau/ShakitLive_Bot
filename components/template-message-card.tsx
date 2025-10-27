"use client";

interface TemplateButton {
  type: string;
  url?: string;
  title: string;
  payload?: string;
}

interface TemplateElement {
  title: string;
  subtitle?: string;
  image_url?: string;
  buttons?: TemplateButton[];
}

interface TemplatePayload {
  template_type: string;
  elements: TemplateElement[];
}

interface TemplateMessageCardProps {
  metadata: string;
}

export function TemplateMessageCard({ metadata }: TemplateMessageCardProps) {
  const parsed = JSON.parse(metadata);
  const payload: TemplatePayload = parsed.payload || parsed;

  // Check if elements exist and are not empty
  if (!payload.elements || payload.elements.length === 0) {
    // If no elements, this might be a button-only message - don't render anything
    return null;
  }

  const element = payload.elements[0]; // For now, display first element

  const handleButtonClick = (button: TemplateButton) => {
    if (button.type === "web_url" && button.url) {
      window.open(button.url, "_blank", "noopener,noreferrer");
    } else if (button.type === "postback") {
      console.log("Postback button clicked:", button.payload);
      // TODO: Handle postback action
    }
  };

  return (
    <div className="bg-primary/10 rounded-lg overflow-hidden max-w-sm border border-primary/20">
      {/* Image Section */}
      {element.image_url && (
        <div className="w-full aspect-video bg-muted relative overflow-hidden">
          <img
            src={element.image_url}
            alt={element.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="text-lg font-bold text-foreground">
          {element.title}
        </h3>

        {/* Subtitle */}
        {element.subtitle && (
          <p className="text-sm text-foreground">
            {element.subtitle}
          </p>
        )}

        {/* Buttons */}
        {element.buttons && element.buttons.length > 0 && (
          <div className="space-y-2 pt-2">
            {element.buttons.map((button, index) => (
              <button
                key={index}
                onClick={() => handleButtonClick(button)}
                className="w-full py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 bg-primary/10 border border-primary/20 hover:bg-primary/20 text-foreground"
              >
                {button.title}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
