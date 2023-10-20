// OPTION_COUNTDOWN_IMPORT
import { Countdown } from '@/components/Countdown';

// OPTION_COUNTDOWN_CODE_EXAMPLE
// Countdown component
const countdown = new Countdown(
  {
    id: 'countdownDM',
    debug: true,
    date: 'Oct 31, 2023 09:00:00',
    isOverMessage: 'in your cinemas',
    onClick,
    gap: 22,
    fontUrl:
      'https://statics.dmcdn.net/d/PRODUCTION/2023/Entertainement_DisneyPlus_Miraculous_0923_Skins_Split_x_3_and_Countdown/assets/V2/ImpasseBold.ttf'
  },
  { left: '3%', width: '70%', bottom: '0%' }
);
root.appendChild(countdown);
