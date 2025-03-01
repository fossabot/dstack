import * as IPFS from "ipfs-core"
import { listen } from "./addresses"

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import WebRTCStar from 'libp2p-webrtc-star'
import { NOISE } from '@chainsafe/libp2p-noise'

export type Options = Omit<IPFS.Options, "libp2p">

export const create = (options?: Options, wrtc?: any): Promise<IPFS.IPFS> => {
  return IPFS.create({
    config: {
      Discovery: {
        webRTCStar: { Enabled: true },
      },
      Addresses: {
        Swarm: listen,
      },
      Bootstrap: [
        '/dns4/dstack-relay.herokuapp.com/tcp/443/wss/p2p-webrtc-star/p2p/QmV2uXBKbii29iJKHKVy8sx5m49qdDTBYNybVoa5uLJtrf',
        '/dns4/ipfs.thedisco.zone/tcp/4430/wss/p2p/12D3KooWChhhfGdB9GJy1GbhghAAKCUR99oCymMEVS4eUcEy67nt',
        '/dns6/ipfs.thedisco.zone/tcp/4430/wss/p2p/12D3KooWChhhfGdB9GJy1GbhghAAKCUR99oCymMEVS4eUcEy67nt'
      ],
      ...options?.config
    },
    ...options,
    libp2p: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      modules: {
        transport: [WebRTCStar],
        // @ts-expect-error: incompatible type
        connEncryption: [NOISE]
      },
      config: {
        peerDiscovery: {
          webRTCStar: {
            enabled: true
          }
        },
        transport: {
          WebRTCStar: {
            wrtc
          }
        }
      },
      dht: {
        enabled: true,
        kBucketSize: 20
      },
    },
  })
}
