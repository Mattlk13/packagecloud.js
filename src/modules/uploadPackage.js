/**
 * Upload a package.
 * @module src/modules/uploadPackage
 * @param {Object} options - Repository options.
 * @param {string} options.repo - The fully-qualified repository name, i.e., 'username/reponame'.
 * @param {string} options.file - The file to upload, must be a File object (browser). Buffer or ./path/to/file (NodeJS).
 * @param {string} options.filename - The filename of the package.
 * @return {Promise} The superagent promise object.
 */
export default (request, options) => {
  if(!options || !options.repo || options.repo.split("/").length < 2) {
    throw new Error("Repository path must be in the fully-qualified format - user/repo");
  }
  if(!options.file) {
    throw new Error("Expects an object with string file path (node) or File (browser) as a value");
  }
  if(!options.filename) {
    throw new Error("Expects a filename");
  }

  let url = [options.baseUrl + "repos", options.repo, "packages.json"].join("/");

  return privateMethods.upload(url, request, options);
}

const privateMethods = {
  /**
   * Upload package from a NodeJS environment.
   * @private
   */
  upload(url, request, options) {
    let fields = {filename: options.filename};

    if(options.dist) {
      fields['package[distro_version_id]'] = options.dist
    }

    return request
      .post(url)
      .field(fields)
      .attach('package[package_file]', options.file);
  }
}
