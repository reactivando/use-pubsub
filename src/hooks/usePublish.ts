import { useEffect, useCallback, useState } from "react";
import debounce from "debounce";
import PubSub from "pubsub-js";

export interface IUsePublishResponse {
  lastPublish: boolean;
  publish: () => void;
}

export interface IUsePublishParams {
  token: string;
  message: string;
  isAutomatic?: boolean;
  isImmediate?: boolean;
  debounceMs?: number;
}

export type UsePublish = (params: IUsePublishParams) => IUsePublishResponse;
export const usePublish: UsePublish = ({
  token,
  message,
  isAutomatic = true,
  isImmediate = true,
  debounceMs = 300,
}) => {
  const [lastPublish, setLastPublish] = useState(false);

  const publish = useCallback(() => {
    const isPublished = PubSub.publish(token, message);

    setLastPublish(isPublished);
  }, [token, message]);

  useEffect(() => {
    if (isAutomatic) {
      publish();
    }
  }, []);

  useEffect(() => {
    if (isAutomatic) {
      const debouncedPublished = debounce(publish, debounceMs, isImmediate);
      debouncedPublished();

      return () => {
        debouncedPublished.clear();
      };
    }
  }, [message, publish, isImmediate, isAutomatic, debounceMs]);

  return { lastPublish, publish };
};