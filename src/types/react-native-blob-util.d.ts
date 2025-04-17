declare module "react-native-blob-util" {
  export interface RNFetchBlobConfig {
    fileCache?: boolean;
    path?: string;
    appendExt?: string;
    addAndroidDownloads?: {
      useDownloadManager?: boolean;
      title?: string;
      description?: string;
      mime?: string;
      mediaScannable?: boolean;
      notification?: boolean;
      path?: string;
    };
  }

  export interface RNFetchBlobResponse {
    path(): string;
    readFile(encoding?: string): Promise<string>;
    base64(): Promise<string>;
    json(): Promise<any>;
    text(): Promise<string>;
    progress(
      callback: (received: number, total: number) => void
    ): RNFetchBlobResponse;
    then<T>(
      onFulfilled?: (response: RNFetchBlobResponse) => T | PromiseLike<T>
    ): Promise<T>;
    catch<T>(onRejected?: (error: Error) => T | PromiseLike<T>): Promise<T>;
  }

  export interface RNFetchBlobStatic {
    config(config: RNFetchBlobConfig): RNFetchBlobStatic;
    fetch(
      method: string,
      url: string,
      headers?: any,
      body?: any
    ): RNFetchBlobResponse;
    fs: {
      dirs: {
        DocumentDir: string;
        CacheDir: string;
        PictureDir: string;
        MusicDir: string;
        DownloadDir: string;
        DCIMDir: string;
        SDCardDir: string;
      };
      exists(path: string): Promise<boolean>;
      mkdir(path: string): Promise<void>;
      unlink(path: string): Promise<void>;
      readFile(path: string, encoding?: string): Promise<string>;
      writeFile(path: string, data: string, encoding?: string): Promise<void>;
    };
  }

  const RNFetchBlob: RNFetchBlobStatic;
  export default RNFetchBlob;
}
