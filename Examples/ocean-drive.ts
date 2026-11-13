/** A car cruising down Ocean Drive. */
export interface Ride {
  readonly model: string;
  readonly color: string;
  topSpeed: number;
}

export enum Hour {
  Sunset = 19,
  Midnight = 24,
}

type Listener = (ride: Ride) => void;

const MAX_CRUISERS = 8;

export class OceanDrive {
  private readonly cruisers: Ride[] = [];
  private readonly listeners: Listener[] = [];

  constructor(public readonly night: string, public hour: Hour = Hour.Sunset) {}

  get fastest(): Ride | undefined {
    return [...this.cruisers].sort((a, b) => b.topSpeed - a.topSpeed)[0];
  }

  onCruise(listener: Listener): void {
    this.listeners.push(listener);
  }

  // The strip only fits so many cars after sunset.
  cruise(ride: Ride): boolean {
    if (!ride || this.cruisers.length >= MAX_CRUISERS) {
      return false;
    }

    this.cruisers.push(ride);
    this.listeners.forEach((listener) => listener(ride));
    return true;
  }

  async playlist(url = 'https://radio.example/miami'): Promise<string[]> {
    const response = await fetch(url);
    const tracks: string[] = await response.json();
    return tracks.filter((track) => /neon|sunset/i.test(track));
  }

  toString(): string {
    return `${this.night}: ${this.cruisers.length} cars, fastest ${this.fastest?.model ?? 'none'}\n`;
  }
}

const drive = new OceanDrive('Friday "neon" night');
drive.onCruise((ride) => console.log(`${ride.model} joins the strip`));
drive.cruise({ model: 'Roadster', color: 'Hot pink', topSpeed: 290 });
drive.cruise({ model: 'Convertible', color: 'Sunset orange', topSpeed: 260 });
console.log(drive.toString(), Hour[drive.hour]);
