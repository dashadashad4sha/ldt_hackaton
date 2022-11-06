import clsx from "clsx";
import { FC, ReactElement, useCallback, useMemo, useState } from "react";
import s from './styles.module.css';

export type TabId = string;

export type Tab = {
  id: TabId;
  label: string | ReactElement;
  content: string | ReactElement;
};

type TabsProps = {
  tabs: Tab[];
  initialTab?: TabId;
};

const Tabs: FC<TabsProps> = ({ tabs, initialTab }) => {
  const [currentTabId, setCurrentTabId] = useState(initialTab || tabs[0].id);

  const heads = useMemo(
    () => tabs.map(({ label, id }) => ({ label, id })),
    [tabs]
  );

  const renderContent = useMemo(
    () => tabs.find((tab) => tab.id === currentTabId)?.content,
    [currentTabId, tabs]
  );

  const handleSelectTab = useCallback(
    (id: TabId) => () => {
      setCurrentTabId(id);
    },
    []
  );

  return (
    <section className={s.wrapper}>
      <div className={s.tabs}>
        {heads.map(({ id, label }) => (
          <div key={id} className={clsx(s.tab, {[s.active]: id === currentTabId})} onClick={handleSelectTab(id)}>
            {label}
          </div>
        ))}
      </div>
      <div className={s.content}>{renderContent}</div>
    </section>
  );
};

export default Tabs;
