// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const tracingClient = new (window as any).MarketingClient({
  apiKey: import.meta.env.VITE_TRACKING_API_KEY,
});

const queue: {
  event: string;
  data: Record<string, string | number | boolean>;
}[] = [];

export const initMarketingClient = async (
  externalId: string,
  attributes: Record<string, string | number | boolean>
) => {
  await tracingClient.init({
    externalId,
    attributes,
  });

  queue.forEach(({ event, data }) => {
    tracingClient.trackEvent(event, data);
  });
};

export const trackEvent = async (
  event: string,
  data: Record<string, string | number | boolean>
) => {
  console.log("tracking event", event, data, tracingClient.currentUser);
  if (tracingClient.currentUser) {
    await tracingClient.trackEvent(event, data);
  } else {
    console.log("queueing event", event, data);
    queue.push({ event, data });
  }
};
