import {
  Code,
  Book,
  Music,
  Heart,
  Video,
  Image,
  Coffee,
  Plane,
  MessageCircle,
  Globe,
  LucideProps,
  BookOpen
} from 'lucide-react';
import { SVGProps } from 'react';

// 图标映射对象 - 字符串到 Lucide 图标的映射
export const ICON_MAP = {
  Code,
  Book,
  Music,
  Heart,
  Video,
  Image,
  Coffee,
  Plane,
  MessageCircle,
  Globe,
  BookOpen
} as const;

export type IconName = keyof typeof ICON_MAP;

type IconProps = {
  iconKey: keyof typeof ICON_MAP;
} & LucideProps;
export const Icon = (props: IconProps) => {
  const { iconKey, ...rest } = props;
  const IconComponent = ICON_MAP[iconKey];
  return <IconComponent {...rest} />;
};

export const Juejin = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 1024 1024" version="1.1" p-id="7329" {...props}>
      <path
        d="M465.189 161.792c-22.967 18.14-44.325 35.109-47.397 37.742l-5.851 4.68 10.971 8.632c5.998 4.827 11.85 9.508 13.02 10.532 1.17 1.024 17.993 14.336 37.156 29.696l34.962 27.795 5.267-3.95c2.925-2.194 23.259-18.432 45.348-35.986 21.943-17.555 41.253-32.768 42.716-33.646 1.609-1.024 2.779-2.194 2.779-2.78 0-0.438-9.655-8.63-21.504-17.846-11.995-9.363-22.674-17.847-23.845-18.871-15.945-13.02-49.737-39.059-50.76-39.059-0.586 0.147-19.896 14.922-42.862 33.061z m233.325 180.37C507.465 493.275 508.928 492.105 505.417 489.911c-3.072-1.902-11.556-8.485-64.073-50.03-9.07-7.168-18.578-14.775-21.358-16.823-2.78-2.194-8.777-6.875-13.312-10.532-4.68-3.657-10.679-8.339-13.312-10.533-13.165-10.24-71.095-56.027-102.107-80.457-5.852-4.681-11.41-8.485-12.142-8.485-0.731 0-10.971 7.754-22.674 17.116-11.703 9.508-22.674 18.286-24.284 19.456-1.755 1.17-5.12 3.95-7.46 6.144-2.34 2.34-4.828 4.096-5.413 4.096-3.072 0-0.731 3.072 6.437 8.777 4.096 3.218 8.777 6.875 10.094 8.046 1.316 1.024 10.24 8.045 19.748 15.506s23.26 18.286 30.428 23.99c19.31 15.215 31.89 25.308 127.853 101.084 47.836 37.742 88.796 69.779 90.844 71.095 3.657 2.487 3.95 2.487 7.46-0.292a1041.42 1041.42 0 0 0 16.092-12.727c6.875-5.413 14.775-11.703 17.554-13.897 30.135-23.699 80.018-63.05 81.774-64.512 1.17-1.024 12.434-9.802 24.868-19.603s37.888-29.696 56.32-44.324c18.579-14.629 46.227-36.425 61.733-48.567 15.506-12.142 27.794-22.528 27.502-23.26-0.878-1.17-57.637-47.104-59.978-48.274-0.731-0.439-18.578 12.727-39.497 29.257z"
        p-id="7330"></path>
      <path
        d="M57.93 489.326c-15.215 12.288-28.527 23.405-29.697 24.576-2.34 2.194-5.412-0.44 80.018 66.852 33.207 26.185 32.622 25.747 57.637 45.495 10.386 8.192 36.279 28.672 57.783 45.495 38.18 30.135 44.91 35.401 52.663 41.545 2.048 1.756 22.967 18.14 46.372 36.572 23.26 18.432 74.167 58.514 112.933 89.088 38.912 30.573 71.095 55.734 71.826 56.027 0.732 0.293 7.46-4.389 14.921-10.386 21.797-16.97 90.259-70.949 101.523-79.872 5.705-4.535 12.873-10.24 15.945-12.58 3.072-2.488 6.436-5.12 7.314-5.852 0.878-0.878 11.85-9.509 24.283-19.31 20.773-16.091 59.1-46.226 64.366-50.615 1.17-1.024 5.12-4.096 8.777-6.875 3.657-2.78 7.9-6.29 9.509-7.607 1.609-1.317 14.775-11.703 29.257-23.113 29.11-22.82 42.277-33.207 88.503-69.632 17.262-13.605 32.475-25.454 33.646-26.478 2.486-2.048 31.451-24.869 44.617-35.255 4.827-3.657 9.07-7.168 9.508-7.607 0.44-0.585 5.998-4.827 12.435-9.8 6.436-4.828 13.165-10.24 15.067-11.85l3.365-2.926-9.948-7.753c-5.412-4.388-10.24-8.192-10.679-8.63-1.17-1.317-22.381-18.433-30.135-24.284-3.95-3.072-7.314-5.998-7.606-6.73-1.317-3.071-6.73 0.147-29.258 17.994-13.458 10.532-25.746 20.187-27.355 21.504-1.61 1.463-10.533 8.338-19.749 15.652-9.216 7.168-17.115 13.459-17.554 13.898-0.439 0.438-6.583 5.412-13.897 10.971-7.168 5.559-15.214 11.703-17.7 13.75-4.974 4.097-5.413 4.39-20.334 16.239-5.56 4.388-11.264 8.777-12.435 9.8-1.17 1.025-20.333 16.092-42.422 33.354-22.09 17.408-41.546 32.768-43.155 34.084-1.609 1.463-14.482 11.557-28.525 22.528s-40.814 32.037-59.539 46.812c-18.578 14.775-42.276 33.353-52.516 41.399s-23.26 18.285-28.965 22.82l-10.386 8.339-4.389-3.072c-2.34-1.756-4.68-3.511-5.12-3.95-0.439-0.439-4.973-4.096-10.24-8.046-11.849-9.216-14.482-11.264-16.676-13.166-0.878-0.877-4.243-3.51-7.46-5.851-3.22-2.487-6.145-4.681-6.584-5.12-0.439-0.439-6.875-5.705-14.482-11.703-7.607-5.851-14.921-11.556-16.091-12.58-1.317-1.17-17.116-13.605-35.255-27.795-17.993-14.19-35.109-27.648-38.035-29.842-5.705-4.681-33.499-26.624-125.074-98.743-34.523-27.209-72.704-57.344-84.846-66.852-49.737-39.498-55.15-43.594-56.905-43.447-0.877 0-14.043 10.24-29.257 22.528z"
        p-id="7331"></path>
    </svg>
  );
};

export const Github = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="6310"
      {...props}>
      <path
        d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9 23.5 23.2 38.1 55.4 38.1 91v112.5c0.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z"
        p-id="6311"></path>
    </svg>
  );
};

export const Email = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="8620"
      width="200"
      height="200"
      {...props}>
      <path
        d="M815.7 262.7H208.3L512 493.9l303.7-231.2z m36.2 27.2L516.5 548.3v4.5-4.5L172.1 289.9v471.4H852l-0.1-471.4z m45.4-72.5v589.2H126.7V217.4h770.6z"
        p-id="8621"></path>
    </svg>
  );
};

export const Calendar = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 20 20"
      data-name="BookTypeReports"
      {...props}>
      <g fill="none" fillRule="evenodd">
        <g transform="translate(1.483 3.01)">
          <rect
            fill="#F6D4C6"
            x="0.517"
            y="0.517"
            width="16"
            height="14.973"
            rx="2"></rect>
          <path
            d="M2 0h13.023a2 2 0 0 1 2 2v2.441H0V2a2 2 0 0 1 2-2Z"
            fill="#DE815A"></path>
          <path stroke="#9D553E" strokeLinecap="square" d="M.591 4.441h15.67"></path>
        </g>
        <path
          stroke="#9D553E"
          strokeLinecap="round"
          d="M5.959 1.235v1.68M13.959 1.235v1.68"></path>
        <rect
          stroke="#9D553E"
          strokeLinecap="round"
          x="2"
          y="3.093"
          width="16"
          height="15.407"
          rx="1.5"></rect>
        <path
          d="M7.054 10.28a.5.5 0 0 1 .763.339l.007.082v5a.5.5 0 0 1-.992.09l-.008-.09-.001-4.084-.553.355a.5.5 0 0 1-.635-.079l-.056-.071a.5.5 0 0 1 .08-.636l.07-.055 1.325-.85ZM14 10.2a.5.5 0 0 1 .492.588l-.022.082-1.794 4.99a.5.5 0 0 1-.964-.251l.023-.088 1.553-4.321h-2.717a.5.5 0 0 1-.492-.41l-.008-.09a.5.5 0 0 1 .41-.491l.09-.008H14Z"
          fill="#9D553E"
          fillRule="nonzero"></path>
      </g>
    </svg>
  );
};

const CustomBook = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 20" data-name="BookTypeBlog" {...props}>
      <g fill="none" fillRule="evenodd" stroke="#397ABD">
        <path
          d="M7.5 6h9A1.5 1.5 0 0 1 18 7.5v9.268a1.5 1.5 0 0 1-1.5 1.5h-9a1.5 1.5 0 0 1-1.5-1.5V7.5A1.5 1.5 0 0 1 7.5 6Z"
          fill="#679FF4"></path>
        <path
          d="M3.5 2h9A1.5 1.5 0 0 1 14 3.5v13.268a1.5 1.5 0 0 1-1.5 1.5h-9a1.5 1.5 0 0 1-1.5-1.5V3.5A1.5 1.5 0 0 1 3.5 2Z"
          fill="#C4DCFF"></path>
        <path strokeLinecap="round" d="M5.5 7.5h5M5.5 12.6h5"></path>
      </g>
    </svg>
  );
};

const Developer = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 20 20"
      data-name="BookTypeImport"
      {...props}>
      <g fill="none" fill-rule="evenodd">
        <path
          d="M2.53 2.5h15a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5h-15a1.5 1.5 0 0 1-1.5-1.5V4a1.5 1.5 0 0 1 1.5-1.5Z"
          stroke="#5B6461"
          stroke-width="0.941"
          fill="#BBC7ED"
          strokeLinecap="round"
          strokeLinejoin="round"></path>
        <path
          d="M3.03 2.5h14a2 2 0 0 1 2 2v2.667h-18V4.5a2 2 0 0 1 2-2Z"
          fill="#91A1DF"></path>
        <path
          d="M2.53 2.5h15a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5h-15a1.5 1.5 0 0 1-1.5-1.5V4a1.5 1.5 0 0 1 1.5-1.5Z"
          stroke="#55629D"
          strokeLinecap="round"
          strokeLinejoin="round"></path>
        <path
          fill="#55629D"
          fillRule="nonzero"
          d="M19.03 6.438v1H.983v-1zM11.185 9.534a.5.5 0 0 1 .31.56l-.024.086-1.805 4.667a.5.5 0 0 1-.957-.274l.025-.086 1.804-4.667a.5.5 0 0 1 .647-.286Zm-4.56 1.38a.5.5 0 0 1-.136.626l-.076.049-1.679.876 1.68.878a.5.5 0 0 1 .246.59l-.035.084a.5.5 0 0 1-.591.247l-.083-.035-1.73-.903a.97.97 0 0 1-.1-1.66l.1-.06 1.73-.903a.5.5 0 0 1 .674.211Zm6.732 0a.5.5 0 0 1 .675-.211l1.729.902.101.062a.97.97 0 0 1-.101 1.66l-1.73.902-.083.035a.5.5 0 0 1-.591-.247l-.035-.083a.5.5 0 0 1 .247-.591l1.679-.878-1.68-.876-.075-.049a.5.5 0 0 1-.136-.626Z"></path>
      </g>
    </svg>
  );
};

const Book2 = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 20" data-name="BookTypeNotes">
      <g
        stroke="#388D68"
        stroke-width="0.976"
        fill="none"
        fillRule="evenodd"
        strokeLinejoin="round"
        {...props}>
        <path
          d="M2.031 2.4H8a2 2 0 0 1 2 2v13.504H8.358a.2.2 0 0 1-.125-.044l-1.147-.913a.2.2 0 0 0-.125-.043h-4.93a1.5 1.5 0 0 1-1.5-1.5V3.9a1.5 1.5 0 0 1 1.5-1.5Z"
          fill="#75CA97"></path>
        <path
          d="M17.969 2.4H12a2 2 0 0 0-2 2v13.504h1.642a.2.2 0 0 0 .125-.044l1.147-.913a.2.2 0 0 1 .125-.043h4.93a1.5 1.5 0 0 0 1.5-1.5V3.9a1.5 1.5 0 0 0-1.5-1.5Z"
          fill="#BBEBC4"
          strokeLinecap="round"></path>
      </g>
    </svg>
  );
};

const Location = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 20 20"
      data-name="BookTypeTravel"
      {...props}>
      <g fill="none" fillRule="evenodd">
        <ellipse cx="10" cy="7.188" rx="3.048" ry="3.04"></ellipse>
        <path
          d="M15.55 13.51c2.453.52 3.95 1.343 3.95 2.485 0 .933-1.1 1.697-2.877 2.22l-.44.121c-.074.02-.15.039-.228.057l-.476.107-.5.097c-.084.016-.17.03-.257.045l-.53.082-.55.072-.283.032-.577.056c-.098.009-.196.017-.295.024l-.602.04-.615.029-.63.017L10 19l-.64-.006-.63-.017-.615-.029-.602-.04a28.905 28.905 0 0 1-.295-.024l-.577-.056c-.095-.01-.189-.02-.282-.032l-.55-.072-.531-.082c-.087-.014-.173-.03-.258-.045l-.499-.097-.476-.107a14.776 14.776 0 0 1-.229-.057l-.44-.12C1.6 17.691.5 16.927.5 15.994c0-1.05 1.262-1.827 3.368-2.35l.521-.121a.5.5 0 0 1 .21.977c-1.958.423-3.099 1.056-3.099 1.494 0 .5 1.091 1.037 2.817 1.43l.445.094c.152.03.309.06.469.088l.493.081.514.074.534.064.553.055c.094.009.188.017.283.024l.578.04c.097.007.196.012.294.017l.6.024.61.012L10 18l.31-.002.61-.012.6-.024.585-.035a28.7 28.7 0 0 0 .57-.046l.553-.055.534-.064.514-.074.493-.08c.16-.029.317-.058.47-.089l.444-.095c1.726-.392 2.817-.93 2.817-1.43 0-.443-1.165-1.083-3.158-1.505a.5.5 0 0 1 .118-.989l.09.01Z"
          fill="#9D553E"
          fillRule="nonzero"></path>
        <path
          d="M10 1c3.314 0 6 2.63 6 5.874 0 1.82-1.368 5.22-4.105 8.202l-.27.29a2.028 2.028 0 0 1-2.78.154l-.114-.104C5.578 12.276 4 8.762 4 6.874 4 3.63 6.686 1 10 1Z"
          stroke="#9D553E"
          fill="#DE815A"
          strokeLinejoin="round"></path>
        <circle
          stroke="#9D553E"
          fill="#F1CFC2"
          strokeLinejoin="round"
          cx="10"
          cy="7"
          r="2.5"></circle>
      </g>
    </svg>
  );
};

const Bilibili = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      className="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="2623"
      width="200"
      height="200"
      {...props}>
      <path
        d="M958.145721 915.770428c-7.946995 0.03-15.98499 0.723-23.840985-0.12-28.837982-3.129998-49.849969 29.619981-59.843963 64.14796-8.999994 31.094981-43.165973 46.989971-73.929953 43.798972-35.520978-3.642998-59.030963-23.961985-68.091958-56.079965-5.448997-19.416988-21.914986-34.467978-40.035975-34.347978-125.014922 0.723-236.212852 0.362-361.226774 0-14.389991-0.03-29.740981 13.756991-33.955979 30.704981-8.999994 36.362977-39.914975 59.451963-74.141953 60.023962-35.429978 0.602-66.224959-21.884986-76.549953-59.632963-4.333997-15.80399-11.649993-49.608969-26.759983-48.765969-19.446988 1.083999-39.012976 0.542-58.519963 0.211-21.311987-0.391-30.733981-8.939994-30.733981-29.168982 0.15-205.688871 0.452-411.347743 0.993999-617.035614 0.06-21.252987 8.879994-28.416982 33.382979-28.446983 100.450937-0.12 200.901874-0.06 301.353812-0.06h21.010987c0.632-1.715999 1.294999-3.461998 1.926999-5.207996-23.329985-12.251992-46.658971-24.502985-69.957957-36.784977-38.680976-20.409987-77.422952-40.757975-116.043927-61.257962-15.65299-8.307995-22.155986-20.980987-13.304992-36.694977 8.939994-15.89399 23.719985-16.856989 39.162976-8.729995 90.697943 47.83297 181.425887 95.60494 271.79283 143.94991 23.148986 12.401992 64.809959 4.966997 79.70995-15.98499 46.207971-65.139959 92.384942-130.281919 138.591914-195.453878 1.624999-2.286999 3.189998-4.664997 4.875996-6.922995C737.194859 0.21 752.15585-4.575997 765.761841 5.869996c15.74399 12.070992 13.033992 26.399984 2.919999 40.757975-18.753988 26.579983-37.506977 53.129967-56.230965 79.71095-25.947984 36.844977-51.865968 73.719954-80.67395 114.659928h26.910983c99.759938 0 199.487875-0.03 299.216813 0.03 30.462981 0.03 35.159978 4.635997 35.189978 34.255979 0.3 202.166874 0.571 404.333747 0.752 606.499621 0.03 28.898982-5.297997 33.805979-35.700978 33.985979z m-149.909906 60.475962c15.95499-1.053999 23.539985-43.316973 28.386982-59.301963h-60.324962c5.929996 17.579989 14.147991 60.505962 31.93798 59.301963z m-587.896633 0.03c17.669989 1.083999 26.007984-41.631974 31.275981-59.180963h-59.421963c4.033997 16.52599 12.341992 58.217964 28.145982 59.179963z m712.881555-675.253578H90.357264v571.942642h842.863473V301.022812zM150.562226 417.879739c0.06-27.874983 13.515992-55.117966 41.570974-55.147966 214.117866-0.03 411.196743-1.564999 625.314609-1.504999 28.475982 0 55.477965 29.078982 55.567965 56.652965 0.362 132.991917-0.21 235.339853 0 368.33077 0.06 28.416982-25.706984 56.621965-55.567965 56.652964-106.742933 0.06-198.945876 0-305.658809 0-106.711933 0-198.915876 0.06-305.657809 0-31.065981-0.03-55.599965-26.038984-55.568965-56.652964 0.15-132.329917-0.24-236.001852 0-368.33077z m671.18958 364.206772c0-125.736921-4.303997-241.119849-4.303997-364.206772H206.130191c0 125.013922-0.723 240.33585-0.722999 364.206772h616.343614zM379.580083 491.209693c1.745999-0.783 3.912998-0.632 11.197993-1.685999 4.244997 4.153997 14.959991 9.873994 16.10499 17.037989 1.293999 8.367995-3.190998 22.967986-9.662994 26.249984-39.553975 20.076987-80.19195 38.168976-120.919925 55.899965-12.402992 5.386997-26.039984 1.323999-29.199981-11.920992-2.076999-8.669995 1.655999-25.135984 7.886995-28.265983 40.757975-20.619987 82.870948-38.591976 124.592922-57.314964z m12.431992 134.195916c7.705995-0.271 17.669989 10.384994 23.239985 18.512989 4.453997 6.471996 2.587998 16.826989 5.718997 24.652984 5.929996 14.900991 17.097989 29.079982 33.593979 25.586984 12.190992-2.557998 23.329985-14.749991 32.47998-24.863984 4.514997-4.996997 3.762998-14.869991 4.846997-22.606986 2.046999-14.569991 10.655993-23.539985 25.044984-23.178986 13.153992 0.331 21.702986 8.277995 23.389985 22.516986 1.082999 8.999994 1.323999 20.167987 6.711996 26.158984 8.609995 9.571994 21.010987 21.130987 32.11998 21.492986 10.052994 0.33 22.274986-11.829993 30.191981-21.221986 5.267997-6.231996 4.966997-17.248989 6.621996-26.249984 2.679998-14.357991 10.987993-23.087986 25.857984-21.943986 14.779991 1.143999 22.546986 10.655993 21.974986 25.496984-1.414999 37.656976-16.37599 68.270957-51.655968 85.068947-32.870979 15.68299-63.57596 8.939994-90.486943-15.171991-1.444999-1.293999-3.190998-2.227999-4.996997-3.461998-8.187995 5.689996-15.77399 12.281992-24.472985 16.82699-28.446982 14.839991-56.923964 13.606991-83.172948-4.634997-28.957982-20.168987-41.871974-49.548969-39.282975-83.714948 0.541-7.404995 14.267991-18.993988 22.274986-19.264988z m209.993869-135.941915c6.982996-12.221992 19.385988-15.56299 30.97498-8.969994 46.025971 26.218984 91.540943 53.339967 136.754915 80.853949 5.417997 3.280998 7.946995 11.167993 9.842994 13.997991 0.512 22.365986-18.000989 34.526978-35.038978 24.923985-45.544972-25.676984-90.336944-52.708967-135.068916-79.82995-11.799993-7.164996-14.297991-19.055988-7.464995-30.975981z"
        fill="#04A7FD"
        p-id="2624"></path>
    </svg>
  );
};

const SvgComp = {
  Juejin,
  Github,
  Email,
  Calendar,
  CustomBook,
  Developer,
  Book2,
  Location,
  Bilibili
};

export type CustomIconNames = keyof typeof SvgComp;
interface Props {
  name: CustomIconNames;
  size?: number;
}
export const CustomIcons = (props: Props & SVGProps<SVGSVGElement>) => {
  const { name, size, ...rest } = props;
  const TargetIcon = SvgComp[name];
  return (
    <TargetIcon
      style={{
        width: size ? `${size}px` : '',
        height: size ? `${size}px` : ''
      }}
      {...rest}
    />
  );
};
