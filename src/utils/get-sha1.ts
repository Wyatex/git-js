import {createHash} from "node:crypto";

export default function getSHA1(content: string) {
  return createHash('sha1').update(content, 'utf8').digest('hex')
}
